import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {
    APPLICATION_NAME,
    BadRequestError,
    CLIENT_USER_NAME,
    clientType,
    errorStatus,
    ID,
    okayStatus,
    sendSingleError
} from "@ranjodhbirkaur/common";

import {ENTRY_CREATED_AT, ENTRY_LANGUAGE_PROPERTY_NAME, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "./Messages";
import {ModelLoggerBodyType, RuleType} from "../util/interface";
import {Model} from "mongoose";
import {DateTime} from 'luxon';
import {
    BOOLEAN_FIElD_TYPE,
    DATE_AND_TIME_FIElD_TYPE,
    DATE_FIElD_TYPE,
    dateEuropeReg,
    DateEuropeRegName,
    dateUsReg,
    DateUsRegName,
    emailReg,
    EmailRegName,
    ErrorMessagesType,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
    HHTimeReg,
    hhTimeReg,
    HHTimeRegName,
    HhTimeRegName,
    INTEGER_FIElD_TYPE,
    ONE_TO_MANY_RELATION,
    ONE_TO_ONE_RELATION,
    REFERENCE_FIELD_TYPE,
    REFERENCE_MODEL_ID,
    REFERENCE_MODEL_NAME,
    REFERENCE_MODEL_TYPE,
    REFERENCE_PROPERTY_NAME,
    SHORT_STRING_FIElD_TYPE,
    urlReg,
    UrlRegName,
    usPhoneReg,
    UsPhoneRegName,
    usZipReg,
    UsZipRegName
} from "@ranjodhbirkaur/constants";
import {createModel} from "../util/methods";

async function fetchEntries(req: Request, res: Response, rules: RuleType[], findWhere: any, getOnlyThese: string[] | string | null, collectionName: string, limit: number, skip: number) {

    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];

    const params = validateParams(req, res, rules, findWhere, getOnlyThese);
    if (params) {
        const {where, getOnly} = params;
        const model: any = createModel({
            rules,
            clientUserName,
            applicationName,
            name: collectionName
        });
        return await model
            .find(where, getOnly)
            .skip(skip)
            .limit(limit);

        /*
        const response2 = await getRanjodhBirData(
            collection.name,
            collection.clientUserName,
            collection[APPLICATION_NAME],
            language,
            {
                skip: Number(skip),
                limit: Number(limit),
                where,
                getOnly
            }
        );

        console.log('re', response2);
        //res.status(okayStatus).send(collections);
        */
    }
    else {
        // params are not valid and error is also sent
    }

}

async function createEntry(rules: RuleType[], req: Request, res: Response, collection: {name: string, clientUserName: string, applicationName: string}) {
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    let body = checkBodyAndRules(rules, req, res);
    if(body) {

        const model: any = createModel({
            rules,
            name: collection.name,
            applicationName,
            clientUserName
        });

        const hasError = await validateUniqueParam(model, rules, body);

        if (!hasError) {
            const item = new model(body);
            await item.save();

            const logBody: ModelLoggerBodyType = {
                modelName: collection.name,
                action: "create",
                actor: req.currentUser[ID],
                time: `${new Date()}`,
                [clientType]: req.currentUser[clientType],
            }

            /*Log it*/
            /*Ignore await*/
            /*writeRanjodhBirData(
                `${collection.name}`,
                collection.clientUserName,
                collection.applicationName,
                EnglishLanguage,
                logBody
            );*/
            return item;
        }
        else {
            res.status(errorStatus).send({
                errors: [hasError]
            });
        }
    }

}

interface GetEntriesProps {
    req: Request;
    res: Response;
    findWhere: any;
    getOnlyThese: string[] | string | null;
    modelName?: string;
    limitEntries?: number;
    skipEntries?: number;
}

async function getEntries(props: GetEntriesProps) {

    const {req, res, limitEntries, modelName, skipEntries, getOnlyThese, findWhere} = props;

    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];

    // get collection
    const collection = await getCollection(req, modelName);
    const limit = limitEntries ? limitEntries : ((req.query && Number(req.query.limit))  || PER_PAGE);
    let skip: number = skipEntries ? skipEntries : ((req.query && Number(req.query.skip)) || 0);

    async function fetchPopulation(population: any, collectionName: string, ids: string[]) {
        const getOnly = (population && population.getOnly) ? population.getOnly : null;

        const collection = await getCollection(req, collectionName);
        if(collection) {
            const rules = JSON.parse(collection.rules);
            const params = validateParams(req, res, rules, {}, getOnly);

            if(params) {
                const model: any = createModel({
                    rules,
                    clientUserName,
                    applicationName,
                    name: collectionName
                });
                if(ids && ids.length) {
                    return await model.find({}, params.getOnly).where('_id').in(ids);
                }
                else {
                    return await model.find({_id: ids}, params.getOnly);
                }

            }

        }

    }

    async function recursivePopulation(items: any[], rules: RuleType[], populate: any) {
        // check if populate exist
        // only populate if there is only one item
        console.log('items', items);

        if(populate && populate.length && (items.length === 1 || typeof items === "string")) {

            for (const population of populate) {
                if(population.name) {
                    // check if the name exist in the rules
                    const ruleExist = rules.find((rule: RuleType) => rule.name === population.name);
                    if(ruleExist && items[0] && items[0][population.name]) {
                        const populatedEntries = await fetchPopulation(population, ruleExist[REFERENCE_MODEL_NAME], items[0][population.name]);

                        if(population.populate && population.populate.length) {
                            const refCollection = await getCollection(req, ruleExist[REFERENCE_MODEL_NAME]);
                            if(refCollection) {
                                const refRules = JSON.parse(refCollection.rules);
                                await recursivePopulation(populatedEntries, refRules, population.populate);
                            }
                        }

                        items[0][population.name] = populatedEntries;
                    }
                }
            }
        }
    }

    if (collection) {
        const rules = JSON.parse(collection.rules);
        let items: any = [];
        items = await fetchEntries(req, res, rules, findWhere, getOnlyThese, collection.name, limit, skip);

        if(req.body && req.body.populate && req.body.populate.length) {
            await recursivePopulation(items, rules, req.body.populate);
        }

        return items;
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}
// Create Record
export async function createStoreRecord(req: Request, res: Response) {

    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    const referenceModelName = `${req.query[REFERENCE_MODEL_NAME] ? req.query[REFERENCE_MODEL_NAME] : ''}`;
    const referencePropertyName = `${req.query[REFERENCE_PROPERTY_NAME] ? req.query[REFERENCE_PROPERTY_NAME] : ''}`;
    const referenceModelId = `${req.query[REFERENCE_MODEL_ID] ? req.query[REFERENCE_MODEL_ID] : ''}`;

    // get collection
    const collection = await getCollection(req);
    if (collection) {
        const rules = JSON.parse(collection.rules);

        // if entry is already created and just requires to be pushed in reference array
        if(req.query[REFERENCE_MODEL_NAME] && req.query[REFERENCE_PROPERTY_NAME]) {
            // check if the reference model exist
            const referenceCollection = await getCollection(req, referenceModelName);
            if(referenceCollection) {
                const referenceCollectionRules = JSON.parse(referenceCollection.rules);
                const referenceModel: any = createModel({
                    rules: referenceCollectionRules,
                    name: referenceCollection.name,
                    applicationName,
                    clientUserName
                });
                const exist = referenceModel.findOne({ _id: referenceModelId }, [referencePropertyName]);

                let propertyName = '';
                let referenceType = '';
                referenceCollectionRules
                    && referenceCollectionRules.length
                    && referenceCollectionRules.map((referenceCollection: RuleType) => {
                        if(referenceCollection) {
                            if(referenceCollection.name === referencePropertyName && referenceCollection.type === REFERENCE_FIELD_TYPE) {
                                propertyName = referencePropertyName;
                                referenceType = referenceCollection[REFERENCE_MODEL_TYPE];
                            }
                        }
                        return false;
                    });
                // check if there is an entry for the modelId and propertyName
                if(propertyName && exist) {
                    let entryId = (req.body && req.body.id) || '';
                    if(req.body && !req.body.id) {
                        const entry = await createEntry(rules, req, res, collection);
                        entryId = entry.id;
                    }
                    if(referenceType === ONE_TO_ONE_RELATION) {
                        const response = await referenceModel.findOneAndUpdate({
                            _id: referenceModelId
                        }, {
                            [referencePropertyName]: entryId
                        });

                        return res.status(okayStatus).send(response);
                    }
                    else if(referenceType === ONE_TO_MANY_RELATION) {
                        const response = await referenceModel.findOneAndUpdate({
                                _id: referenceModelId
                            },
                            {
                                $push: { [referencePropertyName]: entryId }
                            }
                        );

                        return res.status(okayStatus).send(response);
                    }
                }
                else if(!propertyName) {
                    return sendSingleError(res, `${REFERENCE_PROPERTY_NAME} ${propertyName} is not valid`);
                }
                else {
                    return sendSingleError(res, `There is no entry in ${referenceModelName} of id ${referenceModelId}`);
                }

            }
            else {
                console.log('r', referenceModelName, referencePropertyName)
                return sendSingleError(res, 'reference model does not exist');
            }



        }
        else {
            const entry = await createEntry(rules, req, res, collection);
            res.status(okayStatus).send(entry);
        }
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Get Record
export async function getStoreRecord(req: Request, res: Response) {

    const items = await getEntries({
        req, res, findWhere: req.body.where, getOnlyThese: req.body.getOnly
    });

    return res.status(okayStatus).send(items);
}

// create reference
export async function createStoreReferenceRecord(req: Request, res: Response) {

}

// Update Record

// Delete Record


async function getCollection(req: Request, specificModelName?: string) {
    const clientUserName  = req.params && req.params[CLIENT_USER_NAME];
    const modelName = req.params && req.params.modelName;
    const applicationName = req.params && req.params[APPLICATION_NAME];

    const name = specificModelName ? specificModelName : modelName;

    return CollectionModel.findOne(
        {clientUserName, name, applicationName},
        ['name', CLIENT_USER_NAME, 'connectionName', APPLICATION_NAME, 'rules']
        );
}

function checkBodyAndRules(rules: RuleType[], req: Request, res: Response) {

    const reqBody = req.body;
    const language = req.params.language;
    const createdAt = DateTime.local().setZone('UTC').toJSDate();
    let body = {
        [ENTRY_CREATED_AT]: createdAt,
        [ENTRY_LANGUAGE_PROPERTY_NAME]: language
    };
    let isValid = true;
    const errorMessages: ErrorMessagesType[] = [];

    function checkPattern(pattern: string, rule: RuleType, shouldMatch=true) {

        let matchPattern = '';
        let errorMessage = '';
        switch (pattern) {
            case EmailRegName: {
                matchPattern = emailReg;
                errorMessage = 'is not a valid email';
                break;
            }
            case UrlRegName: {
                matchPattern = urlReg;
                errorMessage = 'is not a valid url';
                break;
            }
            case DateUsRegName: {
                matchPattern = dateUsReg;
                errorMessage = 'is not a valid Us Date';
                break;
            }
            case DateEuropeRegName: {
                matchPattern = dateEuropeReg;
                errorMessage = 'is not a valid europe date';
                break;
            }
            case HhTimeRegName: {
                matchPattern = hhTimeReg;
                errorMessage = 'is not a valid time in hh format';
                break;
            }
            case HHTimeRegName: {
                matchPattern = HHTimeReg;
                errorMessage = 'is not a valid time in HH format';
                break;
            }
            case UsZipRegName: {
                matchPattern = usZipReg;
                errorMessage = 'is not a valid us zip code';
                break;
            }
            case UsPhoneRegName: {
                matchPattern = usPhoneReg;
                errorMessage = 'is not a valid us phone';
                break;
            }
            default: {
                matchPattern = pattern;
            }
        }
        const newReg = new RegExp(matchPattern);
        if(!newReg.test(reqBody[rule.name]) && shouldMatch) {

            let message: string = '';

            if(shouldMatch) {
                message = (rule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]
                    ? (rule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN])
                    : errorMessage ? `${rule.name} ${errorMessage}` : `${rule.name} should match regex ${matchPattern}`)
            }
            else {
                message = (rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]
                    ? (rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN])
                    : errorMessage ? `${rule.name} ${errorMessage}` : `${rule.name} should not match regex ${matchPattern}`)
            }
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message
            });
        }
    }

    function checkOnlyAllowedValues(rule: RuleType, stringMode = true) {
        const allowedValues = rule.onlyAllowedValues.split(',');
        const exist = allowedValues.find(allowedValue => {
            if(!stringMode) {
                return (Number(reqBody[rule.name]) === Number(allowedValue.trim()))
            }
            return (`${reqBody[rule.name]}` === allowedValue.trim())
        });
        if(!exist) {
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message: `${rule.name} is not a allowed value`
            })
        }
    }

    function checkDefaultValue(rule: RuleType, type: 'string' | 'number' | 'boolean') {
        const value = reqBody[rule.name];
        if(!value && value !== 0) {
            if(type === 'string') {
                reqBody[rule.name] = rule.default;
            }
            else if(type === 'number') {
                reqBody[rule.name] = Number(rule.default);
            }
            else if(type === 'boolean') {
                if(value !== false) {
                    reqBody[rule.name] = rule.default === 'true';
                }
            }

        }
    }

    function checkForDate(rule: RuleType) {
        if (typeof reqBody[rule.name] !== 'string') {
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message: `${rule.name} should be of type string`
            });
        }
        else {
            // validate date
            const luxonTime = DateTime.fromISO(reqBody[rule.name]).setZone('UCT');
            if(luxonTime.invalidReason) {
                isValid = false;
                errorMessages.push({
                    field: rule.name,
                    message: `${rule.name} is not a valid date`
                });
            }
            else {
                reqBody[rule.name] = DateTime.fromISO(reqBody[rule.name]).setZone('UTC').toJSDate();
            }
        }
    }

    rules.forEach((rule) => {
        // check for required params
        if (((reqBody[rule.name] === undefined || reqBody[rule.name] === null)  && rule.required)) {
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message: `${rule.name} is required`
            });
        }
        // check the types
        if (reqBody[rule.name] !== undefined) {

            switch (rule.type) {
                case SHORT_STRING_FIElD_TYPE: {
                    reqBody[rule.name]= `${reqBody[rule.name]}`;

                    // check rule min
                    if(rule.min && reqBody[rule.name].length < Number(rule.min)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX])
                                : `${rule.name} should have minimum ${rule.min} characters`)
                        });
                    }
                    // check rule max
                    if(rule.max && reqBody[rule.name].length > Number(rule.max)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX])
                                : `${rule.name} should have maximum ${rule.max} characters`)
                        });
                    }

                    // check match Pattern
                    if(rule.matchSpecificPattern) {
                        checkPattern(rule.matchSpecificPattern, rule);
                    }
                    if(rule.matchCustomSpecificPattern) {
                        checkPattern(rule.matchCustomSpecificPattern, rule);
                    }
                    // check prohibit patter
                    if(rule.prohibitSpecificPattern) {
                        checkPattern(rule.prohibitSpecificPattern, rule, false);
                    }
                    // only allowed values
                    if(isValid && rule.onlyAllowedValues && reqBody[rule.name] !== undefined) {
                        checkOnlyAllowedValues(rule);
                    }

                    if(isValid && rule.default) {
                        checkDefaultValue(rule, "string");
                    }
                    break;
                }
                case INTEGER_FIElD_TYPE: {

                    reqBody[rule.name] = Number(reqBody[rule.name]);

                    // check rule min
                    if(rule.min && reqBody[rule.name] < Number(rule.min)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX])
                                : `${rule.name} should be a minimum ${rule.min}`)
                        });
                    }
                    // check rule max
                    if(rule.max && reqBody[rule.name] > (Number(rule.max))) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX])
                                : `${rule.name} should be maximum ${rule.max}`)
                        });
                    }

                    // only allowed values
                    if(isValid && rule.onlyAllowedValues && reqBody[rule.name] !== undefined) {
                        checkOnlyAllowedValues(rule);
                    }

                    if(isValid && rule.default) {
                        checkDefaultValue(rule, "number");
                    }

                    break;
                }
                case BOOLEAN_FIElD_TYPE: {
                    if (typeof reqBody[rule.name] !== 'boolean') {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be of type ${rule.type}`
                        });
                    }
                    if(isValid && rule.default) {
                        checkDefaultValue(rule, "boolean");
                    }
                    break;
                }
                case DATE_FIElD_TYPE: {
                    checkForDate(rule);
                    break;
                }
                case DATE_AND_TIME_FIElD_TYPE: {
                    checkForDate(rule);
                    break;
                }
                case REFERENCE_FIELD_TYPE: {
                    if(typeof reqBody[rule.name] !== "string" || !reqBody[rule.name]) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be a valid id`
                        })
                    }
                    break;
                }
                case 'html': {
                    if (typeof reqBody[rule.name] !== 'string') {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be of type string`
                        });
                    }
                    break;
                }
            }
        }
        if (isValid) {
            body = {
                ...body,
                [rule.name] : reqBody[rule.name]
            };
            if (!reqBody[rule.name] && rule.default) {
                const defaultValue = rule.type === BOOLEAN_FIElD_TYPE
                    ? rule.default === 'true'
                    : rule.default
                body = {
                    ...body,
                    [rule.name] : defaultValue
                };
            }
        }
    });
    if (isValid) {
        return body;
    }
    else {
        res.status(errorStatus).send({
            errors: errorMessages
        })
    }
}

// Validate Params for where and getOnly
function validateParams(req: Request, res: Response, rules: RuleType[], findWhere: any, getOnly: string[] | string | null) {
    let isValid = true;
    const errorMessages = [];
    if (findWhere && typeof findWhere === 'object') {
        let where = {};
        // Iterate where
        for(const condition in findWhere) {
            if (findWhere.hasOwnProperty(condition)) {
                const ruleExist = rules.find(rule => rule.name === condition);
                if(ruleExist) {
                    where = {
                        ...where,
                        [condition]: findWhere[condition]
                    }
                }
                if (!ruleExist) {
                    isValid = false;
                    errorMessages.push({
                        field: 'where',
                        message: `${condition} does not exist in schema`
                    })
                }
            }
        }
    }
    if (getOnly && (typeof getOnly === 'object' || typeof getOnly === 'string')) {
        if (typeof getOnly === 'string') {
            const exist = rules.find(rule => rule.name === getOnly);
            if (!exist) {
                isValid = false;
                errorMessages.push({
                    field: 'getOnly',
                    message: getOnly+' does not exist in schema'
                });
            }
        }
        else {
            // if the type is object|Array
            if (getOnly.length) {
                getOnly.forEach((str: string) => {
                    const exist = rules.find(rule => rule.name === str);
                    if (!exist) {
                        isValid = false;
                        errorMessages.push({
                            field: 'getOnly',
                            message: `${str} does not exist in schema`
                        })
                    }
                });
            }
            else {
                getOnly = null;
            }
        }
    }
    else {
        if (getOnly) {
            isValid = false;
            errorMessages.push({
                field: 'getOnly',
                message: 'getOnly should be an array of params to get or a string of param'
            });
        }
        // getOnly does not exist
        getOnly = null;
    }

    if (!isValid) {
        res.status(errorStatus).send({
            errors: errorMessages
        });
        return false;
    }
    return {
        where: findWhere, getOnly
    };
}

// To be deleted
async function validateUniqueParam(model: Model<any>, rules: RuleType[], reqBody: any) {
    let errorMessage: string | null = null;
    let field: string = '';

    for(let i = 0; i<=rules.length-1; i++) {
        if (rules && rules[i].unique && reqBody[rules[i].name]) {
            const exist = await model.find({[rules[i].name]: reqBody[rules[i].name]}, '_id');
            if (exist && exist.length) {
                errorMessage = `${rules[i].name} ${PARAM_SHOULD_BE_UNIQUE}. Value ${reqBody[rules[i].name]} already exist.`;
                field = rules[i].name;
            }
        }
    }
    if (errorMessage && field) {
        return {
            message: errorMessage,
            field
        };
    }
    else {
        return null;
    }

}


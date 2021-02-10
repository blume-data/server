import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {
    APPLICATION_NAME,
    BadRequestError,
    CLIENT_USER_NAME,
    errorStatus,
    okayStatus,
    sendSingleError,
    CLIENT_USER_MODEL_NAME, getPageAndPerPage, paginateData
} from "@ranjodhbirkaur/common";

import {ENTRY_LANGUAGE_PROPERTY_NAME, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "./Messages";
import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {DateTime} from 'luxon';
import {FileModel} from '../models/file-models';
import {
    RuleType,
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
    UsZipRegName,
    ENTRY_CREATED_AT,
    ENTRY_UPDATED_AT,
    ENTRY_CREATED_BY,
    ENTRY_UPDATED_BY,
    ENTRY_DELETED_BY,
    MEDIA_FIELD_TYPE,
    SINGLE_ASSETS_TYPE, MULTIPLE_ASSETS_TYPE
} from "@ranjodhbirkaur/constants";
import {createModel, getModel, sendOkayResponse, trimGetOnly} from "../util/methods";

interface PopulateData {
    name: string;
    getOnly?: string[];
    populate?: PopulateData[];
}

interface PopulateMongooseData {
    path: string;
    select?: string;
    populate?: PopulateMongooseData;
}

async function fetchEntries(req: Request, res: Response, rules: RuleType[], findWhere: any, getOnlyThese: string[] | string | null, collectionName: string, limit: number, skip: number) {

    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    let isValid = true;
    let errorMessages: ErrorMessagesType[] = [];

    const params = validateParams(req, res, rules, findWhere, getOnlyThese);

    async function recursivePopulation(res: Response, populate: PopulateData[], mongoosePopulate: PopulateMongooseData, modelName: string, query?: any) {
        if(populate && populate.length) {
            for (const population of populate) {
                if(population && population.name) {
                    let mRules: RuleType[] = [];
                    if(modelName === collectionName) {
                        mRules = rules;
                    }
                    else {
                        const col = await getCollection(req, modelName);
                        if(col) {
                            mRules = JSON.parse(col.rules);
                        }
                        else {
                            isValid = false;
                            errorMessages.push({
                                field: 'populate',
                                message: `${modelName} is not a valid model`
                            });
                            res.status(okayStatus).send({
                                errors: errorMessages
                            });
                            return;
                        }
                    }
                    let exist = mRules.find(rule => rule.name === population.name);
                    let isUserField = false;
                    if(population.name === ENTRY_DELETED_BY
                        || population.name === ENTRY_CREATED_BY
                        || population.name === ENTRY_UPDATED_BY) {
                        isUserField = true;
                    }
                    if((exist && exist[REFERENCE_MODEL_NAME]) || isUserField) {
                        const modelName = (exist && exist[REFERENCE_MODEL_NAME] && exist[REFERENCE_MODEL_NAME] !== '')
                            ? exist[REFERENCE_MODEL_NAME] || CLIENT_USER_MODEL_NAME
                            : CLIENT_USER_MODEL_NAME;
                        try {
                            if(!mongoose.model(modelName) || !mongoose.model(modelName).schema) {
                                await getModel(req, modelName, applicationName, clientUserName);
                            }
                        }
                        catch (e) {
                            await getModel(req, modelName, applicationName, clientUserName);
                        }

                        mongoosePopulate.path = population.name;
                        if(population.getOnly) {
                            if(population.getOnly && population.getOnly.length) {
                                mongoosePopulate.select = trimGetOnly(population.getOnly);
                            }
                            else {
                                mongoosePopulate.select = trimGetOnly(population.getOnly);
                            }
                        }
                        else {
                            mongoosePopulate.select = trimGetOnly(population.getOnly);
                        }
                        if(population.populate && mongoosePopulate.path) {
                            mongoosePopulate.populate = { path: '' };
                            const pd = await recursivePopulation(res, population.populate,mongoosePopulate.populate,modelName );
                            if(pd) {
                                mongoosePopulate.populate = pd;
                            }
                        }
                        if(query) {
                            query.populate(mongoosePopulate);
                        }

                    }
                    else {
                        isValid = false;
                        errorMessages.push({
                            field: 'populate',
                            message: `${population.name} is not a valid reference`
                        });
                        res.status(okayStatus).send({
                            errors: errorMessages
                        });
                        return;
                    }
                }
                else {
                    isValid = false;
                    errorMessages.push({
                        field: 'populate',
                        message: 'name is not valid'
                    });
                    res.status(okayStatus).send({
                        errors: errorMessages
                    });
                    return;
                }
            }
            return mongoosePopulate;
        }

    }

    if (params) {
        const {where} = params;
        // skip language property name
        const getOnly = trimGetOnly(params.getOnly);

        const model: any = createModel({
            rules,
            clientUserName,
            applicationName,
            name: collectionName
        });

        const {page, perPage} = getPageAndPerPage(req);

        console.log('model', model)

        if(isValid) {
            const query =  model
                .find(where, getOnly)
                .skip(Number(page) * Number(perPage))
                .limit(Number(perPage));

            // check if there is an asset
            const existAsset = rules.find(rule => rule.type === MEDIA_FIELD_TYPE);
            if(existAsset) {
                query.populate(existAsset.name, 'name');
            }

            if(req.body && req.body.populate && req.body.populate.length) {
                await recursivePopulation(res, req.body.populate, {path: ''}, collectionName, query);
            }

            query.exec(async (err: any, items: any) => {
                console.log('err', err);
                if(isValid) {
                    const data = await paginateData({
                        Model: model, where, items, req
                    });
                    return res.status(okayStatus).send(data);
                }
            });

        }
        else {
            return res.status(errorStatus).send(errorMessages);
        }

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
            try {
                const item = new model(body);
                await item.save();
                return item;
            }
            catch (e) {
                const errors: ErrorMessagesType[] = [];
                for (let error in e.errors) {
                    if(e.errors.hasOwnProperty(error)) {
                        errors.push({
                            message: `${error} is not valid`,
                            field: error
                        });
                    }
                }
                return res.status(errorStatus).send(errors);
            }
        }
        else {
            return res.status(errorStatus).send({
                errors: [hasError]
            });
        }
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
                                referenceType = referenceCollection[REFERENCE_MODEL_TYPE] || '';
                            }
                        }
                        return false;
                    });
                // check if there is an entry for the modelId and propertyName
                if(propertyName && exist) {
                    let entryId = (req.body && req.body.id) || '';
                    if(req.body && !req.body.id) {
                        const entry = await createEntry(rules, req, res, collection);
                        if(entry && entry.id) {
                            entryId = entry.id;
                        }
                        else {
                            // validation failed
                            return;
                        }
                    }
                    if(referenceType === ONE_TO_ONE_RELATION) {
                        const response = await referenceModel.findOneAndUpdate({
                            _id: referenceModelId
                        }, {
                            [referencePropertyName]: entryId
                        });

                        return sendOkayResponse(res, {
                            id: response.id
                        });
                    }
                    else if(referenceType === ONE_TO_MANY_RELATION) {
                        const response = await referenceModel.findOneAndUpdate({
                                _id: referenceModelId
                            },
                            {
                                $push: { [referencePropertyName]: entryId }
                            }
                        );

                        return sendOkayResponse(res, {
                            id: response.id
                        });
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
                return sendSingleError(res, 'reference model does not exist');
            }
        }
        else {
            const entry = await createEntry(rules, req, res, collection);
            if(entry && entry.id) {
                sendOkayResponse(res, {
                    id: entry.id
                });
            }
        }
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// ANY Record
export async function getStoreRecord(req: Request, res: Response) {

    const findWhere = req.body.where;
    const getOnlyThese = req.body.getOnly;

    // get collection
    const collection = await getCollection(req);
    const limit = ((req.query && Number(req.query.limit))  || PER_PAGE);
    let skip: number = (req.query && Number(req.query.skip)) || 0;

    if (collection) {
        const rules = JSON.parse(collection.rules);

        await fetchEntries(req, res, rules, findWhere, getOnlyThese, collection.name, limit, skip);
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// create reference
export async function createStoreReferenceRecord(req: Request, res: Response) {

}

// Update Record

// Delete Record


export async function getCollection(req: Request, specificModelName?: string) {
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
    const currentUserId = (req.currentUser && req.currentUser.id) ? req.currentUser.id : '';
    const language = req.params.language;
    const createdAt = DateTime.local().setZone('UTC').toJSDate();
    let body = {
        [ENTRY_CREATED_AT]: createdAt,
        [ENTRY_UPDATED_AT]: createdAt,
        [ENTRY_CREATED_BY]: currentUserId,
        [ENTRY_UPDATED_BY]: currentUserId,
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
                    ? (`${rule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]}`)
                    : errorMessage ? `${rule.name} ${errorMessage}` : `${rule.name} should match regex ${matchPattern}`)
            }
            else {
                message = (rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]
                    ? (`${rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]}`)
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
        const allowedValues = rule.onlyAllowedValues && rule.onlyAllowedValues.split(',');
        if(allowedValues) {
            const exist = allowedValues.find(allowedValue => {
                if(!stringMode) {
                    return (Number(reqBody[rule.name]) === Number(allowedValue.trim()))
                }
                return (`${reqBody[rule.name]}`.trim() === allowedValue.trim())
            });
            if(!exist) {
                isValid = false;
                errorMessages.push({
                    field: rule.name,
                    message: `${reqBody[rule.name]} is not a allowed value`
                })
            }
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
                                ? (`${rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]}`)
                                : `${rule.name} should have minimum ${rule.min} characters`)
                        });
                    }
                    // check rule max
                    if(rule.max && reqBody[rule.name].length > Number(rule.max)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (`${rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]}`)
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
                                ? (`${rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]}`)
                                : `${rule.name} should be a minimum ${rule.min}`)
                        });
                    }
                    // check rule max
                    if(rule.max && reqBody[rule.name] > (Number(rule.max))) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: (rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]
                                ? (`${rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]}`)
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
                    if(rule[REFERENCE_MODEL_TYPE] === ONE_TO_ONE_RELATION) {
                        if(typeof reqBody[rule.name] !== "string" || !reqBody[rule.name]) {
                            isValid = false;
                            errorMessages.push({
                                field: rule.name,
                                message: `${rule.name} should be a valid id`
                            });
                        }
                    }
                    if(rule[REFERENCE_MODEL_TYPE] === ONE_TO_MANY_RELATION && reqBody[rule.name]) {
                        if(!(Array.isArray(reqBody[rule.name]) && reqBody[rule.name].length)) {
                            isValid = false;
                            errorMessages.push({
                                field: rule.name,
                                message: `${rule.name} should be an array of id`
                            });
                        }
                    }

                    break;
                }
                case MEDIA_FIELD_TYPE: {
                    if(rule.assetsType === SINGLE_ASSETS_TYPE) {
                        if(typeof reqBody[rule.name] !== "string" || !reqBody[rule.name]) {
                            isValid = false;
                            errorMessages.push({
                                field: rule.name,
                                message: `${rule.name} should be a valid id`
                            });
                        }
                    }
                    if(rule.assetsType === MULTIPLE_ASSETS_TYPE && reqBody[rule.name]) {
                        if(!(Array.isArray(reqBody[rule.name]) && reqBody[rule.name].length)) {
                            isValid = false;
                            errorMessages.push({
                                field: rule.name,
                                message: `${rule.name} should be an array of id`
                            });
                        }
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


import {Request, Response} from 'express';
import {
    APPLICATION_NAME,
    BadRequestError,
    CLIENT_USER_MODEL_NAME,
    CLIENT_USER_NAME,
    errorStatus,
    getPageAndPerPage, ID,
    okayStatus,
    paginateData,
    REFFERENCE_ID_UNIQUE_NAME,
    sendSingleError, SKIP_PROPERTIES_IN_ENTRIES
} from "../../../util/common-module";
import { v4 as uuidv4 } from 'uuid';

import {ENTRY_LANGUAGE_PROPERTY_NAME, TIMEZONE_DATE_CONSTANT} from "../../../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "../../../util/Messages";
import * as mongoose from "mongoose";
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
    ENTRY_CREATED_AT,
    ENTRY_CREATED_BY,
    ENTRY_DELETED_BY,
    ENTRY_UPDATED_AT,
    ENTRY_UPDATED_BY,
    ErrorMessagesType,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
    HHTimeReg,
    hhTimeReg,
    HHTimeRegName,
    HhTimeRegName,
    INTEGER_FIElD_TYPE,
    JSON_FIELD_TYPE,
    MEDIA_FIELD_TYPE,
    MULTIPLE_ASSETS_TYPE,
    ONE_TO_MANY_RELATION,
    ONE_TO_ONE_RELATION,
    REFERENCE_FIELD_TYPE,
    REFERENCE_MODEL_ID,
    REFERENCE_MODEL_NAME,
    REFERENCE_MODEL_TYPE,
    REFERENCE_PROPERTY_NAME,
    RuleType,
    SHORT_STRING_FIElD_TYPE,
    SINGLE_ASSETS_TYPE, STATUS, TITLE_FIELD,
    urlReg,
    UrlRegName,
    usPhoneReg,
    UsPhoneRegName,
    usZipReg,
    UsZipRegName, PUBLISHED_ENTRY_STATUS, ENV
} from "@ranjodhbirkaur/constants";
import {createModel, getModel, sendOkayResponse, trimGetOnly} from "../../../util/methods";
import {CollectionModel} from "../../../db-models/Collection";
import { CustomCollectionModel } from '../../../db-models/CustomCollections';
import {v4} from 'uuid';
import { body } from 'express-validator';
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

async function fetchEntries(req: Request, res: Response, rules: RuleType[], findWhere: any, getOnlyThese: string[] | null, collection: any) {

    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    const collectionName = collection.name;
    let isValid = true;
    let errorMessages: ErrorMessagesType[] = [];

    const params = validateParams(req, res, rules, findWhere, getOnlyThese, collectionName);

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
                        
                        const refName = mRules.find(r => r.name === population.name);
                        if(refName) {
                            mongoosePopulate.path = `${refName.type}${refName.indexNumber}`;
                        }

                        if(population.getOnly) {
                            if(population.getOnly && population.getOnly.length) {
                                const select: string[] = [];
                                const refCollection = await getCollection(req, population.name);
                                // TODO memorize this result
                                console.log('TODO: try to memorize this result');
                                if(refCollection) {
                                    const refRules = JSON.parse(refCollection.rules);
                                    if(refRules) {
                                        population.getOnly.forEach((item, index) => {
                                            const ex = refRules.find((ru: any) => ru.name === item);
                                            if(ex) {
                                                select.push(`${ex.type}${ex.indexNumber}`);
                                            }
                                        });
                                    }
                                }
                                mongoosePopulate.select = trimGetOnly(select);
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
                            const pd = await recursivePopulation(res, population.populate, mongoosePopulate.populate, modelName);
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
            console.log('mongoose populate', mongoosePopulate);
            return mongoosePopulate;
        }
    }

    if (params) {
        const {where} = params;
        // skip language property name
        let getOnly = trimGetOnly(params.getOnly);

        // add any refference field if available
        if(req.body.populate && req.body.populate.length) {
            req.body.populate.forEach((ele: PopulateData) => {
                const popExist = rules.find(rule => rule.name === ele.name);
                if(popExist) {
                    getOnly+= ` ${popExist.type}${REFFERENCE_ID_UNIQUE_NAME}${popExist.indexNumber}`;
                }
            });
        }

        const {page, perPage} = getPageAndPerPage(req);

        if(isValid) {
            const query = CustomCollectionModel
                .find(where, getOnly)
                .skip(Number(page) * Number(perPage))
                .limit(Number(perPage));

            //check if there is an asset
            const existAsset = rules.find(rule => rule.type === MEDIA_FIELD_TYPE);
            if(existAsset) {
                query.populate(existAsset.name, 'fileName thumbnailUrl');
            }

            if(req.body && req.body.populate && req.body.populate.length) {
                await recursivePopulation(res, req.body.populate, {path: ''}, collectionName, query);
            }

            try {
                const items = await query;
                if(isValid) {
                    const data = await paginateData({
                        Model: CustomCollectionModel, where, items, req, rules
                    });
                    return res.status(okayStatus).send(data);
                }
                
            } catch (error) {
                console.log('Error', error);
                return sendSingleError(res, 'something went wrong');
            }
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
    const env = req.params[ENV];

    const requestBody = req && req.body;
    const body = checkBodyAndRules(rules, req, res);
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
                if(requestBody.id) {
                    await CustomCollectionModel.findOneAndUpdate({
                        id: body.id
                    }, body);
                    
                    return {
                        id: requestBody.id
                    };
                }
                else {
                    const item = new CustomCollectionModel({
                        ...body,
                        name: collection.name,
                        applicationName,
                        clientUserName,
                        env,
                        id: v4(),
                        status: PUBLISHED_ENTRY_STATUS,
                        data: JSON.stringify(body.data),
                    })
                    const response: any = await item.save();
                    return {id: response.id};
                }
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

// Create/Update Record
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
                        const entry: any = await createEntry(rules, req, res, collection);
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
            const entry: any = await createEntry(rules, req, res, collection);
            if(entry && entry.id) {
                sendOkayResponse(res, {
                    id : entry.id
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

    if (collection) {
        const rules = JSON.parse(collection.rules);

        await fetchEntries(req, res, rules, findWhere, getOnlyThese, collection);
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// create reference
export async function createStoreReferenceRecord() {

}

// Update Record

// Delete Record
export async function deleteStoreRecord(req: Request, res: Response) {

    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    // get collection
    const collection = await getCollection(req);
    const findWhere = req.body.where;

    if(collection) {
        const rules = JSON.parse(collection.rules);
        const params = validateParams(req, res, rules, findWhere, [], collection.name);
        const model: any = createModel({
            rules,
            clientUserName,
            applicationName,
            name: collection.name
        });

        // if there is an array of ids in where
        if(params && params.where 
            && params.where._id 
            && Array.isArray(params.where._id) 
            && params.where._id.length) {
                const r =await model.deleteMany({
                    _id: { $in: params.where._id}
                });
                if(r && r.deletedCount === params.where._id.length) {
                    return res.status(okayStatus).send(`deleted ${r.deletedCount} entries`);
                }
                else {
                    return res.status(okayStatus).send(0);
                }
            }
        else {
            await model.deleteOne(params && params.where ? params.where : {});
            return res.status(okayStatus).send(true);
        }
    }
}

export async function getCollection(req: Request, specificModelName?: string) {
    const clientUserName  = req.params && req.params[CLIENT_USER_NAME];
    const modelName = req.params && req.params.modelName;
    const applicationName = req.params && req.params[APPLICATION_NAME];

    const name = specificModelName ? specificModelName : modelName;

    return CollectionModel.findOne(
        {clientUserName, name, applicationName},
        ['name', CLIENT_USER_NAME, 'connectionName', APPLICATION_NAME, 'rules', TITLE_FIELD]
        );
}

function checkBodyAndRules(rules: RuleType[], req: Request, res: Response) {

    const reqBody: any = req.body;
    const currentUserId = (req.currentUser && req.currentUser.id) ? req.currentUser.id : '';
    const language = req.params.language;
    const createdAt = DateTime.local().setZone('UTC').toJSDate();
    let body: any = {};

    if(req.method === 'POST') {
        body = {
            ...body,
            [ENTRY_CREATED_AT]: createdAt,
            [ENTRY_UPDATED_AT]: createdAt,
            [`${ENTRY_CREATED_BY}Id`]: currentUserId,
            [`${ENTRY_UPDATED_BY}Id`]: currentUserId,
            [ENTRY_LANGUAGE_PROPERTY_NAME]: language,
            data: {}
        };
    }

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
            const exist = allowedValues.find((allowedValue: string) => {
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

    function checkForDate(rule: RuleType, alsoTime = false) {
        if (typeof reqBody[rule.name] !== 'string') {
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message: `${rule.name} is not a valid date`
            });
        }
        else {
            // validate date
            const luxonTime = DateTime.fromISO(reqBody[rule.name]);
            if(luxonTime.invalidReason) {
                isValid = false;
                errorMessages.push({
                    field: rule.name,
                    message: `${rule.name} is not a valid date`
                });
            }
            else {
                if(alsoTime) {
                    body = {
                        ...body,
                        [`${rule.name}-${TIMEZONE_DATE_CONSTANT}`]: DateTime.fromISO(reqBody[rule.name], {setZone: true}).zoneName
                    };
                    reqBody[`${rule.name}-${TIMEZONE_DATE_CONSTANT}`] = DateTime.fromISO(reqBody[rule.name], {setZone: true}).zoneName;
                }
                reqBody[rule.name] = DateTime.fromISO(reqBody[rule.name]).setZone('UTC').toJSDate();
            }
        }
    }

    rules.forEach((rule) => {
        // check for required params
        if (((reqBody[rule.name] === undefined || reqBody[rule.name] === null)  && rule.required && !reqBody._id)) {
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
                    checkForDate(rule, true);
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
                case JSON_FIELD_TYPE: {
                    if(reqBody[rule.name] && typeof reqBody[rule.name] !== 'object') {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} is not a valid json`
                        });
                    }
                    break;
                }
            }
        }
        if (isValid) {
            if(rule.indexNumber !== undefined) {
                if(rule.type === REFERENCE_FIELD_TYPE) {
                    console.log('reg', `${rule.type}Id${rule.indexNumber}`)
                    body = {
                        ...body,
                        [`${rule.type}${REFFERENCE_ID_UNIQUE_NAME}${rule.indexNumber}`]: reqBody[rule.name]
                    }
                }
                else {
                    body = {
                        ...body,
                        [`${rule.type}${rule.indexNumber}`]: reqBody[rule.name]
                    }
                }
            }
            // irrevelant
            else {
                body = {
                    ...body,
                    data: {
                        ...body.data,
                        [rule.name] : reqBody[rule.name]
                    }
                };
            }

            if (!reqBody[rule.name] && rule.default) {
                const defaultValue = rule.type === BOOLEAN_FIElD_TYPE
                    ? rule.default === 'true'
                    : rule.default
                body = {
                    ...body,
                    data: {
                        ...body.data,
                        [rule.name] : defaultValue,
                    }
                };
            }
            // if there is id in req body add it in body
            if(reqBody.id) {
                body.id = reqBody.id;
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
function validateParams(req: Request, res: Response, rules: RuleType[], findWhere: any, getOnly: string[] | null, collectionName: string) {
    let isValid = true;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    const env = req.params[ENV];
    const errorMessages = [];
    let where: any = {
        name: collectionName,
        clientUserName,
        applicationName,
        env
    };
    const skip = SKIP_PROPERTIES_IN_ENTRIES;
    if (findWhere && typeof findWhere === 'object') {
        // Iterate where
        for(const condition in findWhere) {
            if (findWhere.hasOwnProperty(condition)) {
                const ruleExist = rules.find(rule => rule.name === condition);
                if(ruleExist) {
                    where = {
                        ...where,
                        [`${ruleExist.type}${ruleExist.indexNumber}`]: findWhere[condition]
                    }
                }
                if (!ruleExist && !skip.includes(condition)) {
                    isValid = false;
                    errorMessages.push({
                        field: 'where',
                        message: `${condition} does not exist in schema`
                    });
                }

                if(condition === 'id' && (!findWhere['id'])) {
                    isValid = false;
                    errorMessages.push({
                        field: 'where',
                        message: 'id is not valid'
                    });
                }
                if(condition === 'id' && findWhere['id']) {
                    where = {
                        ...where,
                        id: findWhere[condition]
                    }
                }
                if(skip.includes(condition) && condition !== 'id') {
                    where = {
                        ...where,
                        [condition]: findWhere[condition]
                    }
                }
            }
        }
    }
    if (getOnly && Array.isArray(getOnly)) {
        // if the type is object|Array
        if (getOnly.length) {
            getOnly.forEach((str: string, index: number) => {
                const exist = rules.find(rule => rule.name === str);
                if (!exist && !skip.includes(str)) {
                    isValid = false;
                    errorMessages.push({
                        field: 'getOnly',
                        message: `${str} does not exist in schema`
                    })
                }
                else if(exist && getOnly) {
                    if(exist.type === REFERENCE_FIELD_TYPE) {
                        getOnly[index] = `${REFERENCE_FIELD_TYPE}${REFFERENCE_ID_UNIQUE_NAME}${exist.indexNumber}`;
                    }
                    else {
                        getOnly[index]= `${exist.type}${exist.indexNumber}`;
                    }
                }
            });
        }
        else {
            getOnly = null;
        }

    }
    else {
        if (getOnly) {
            isValid = false;
            errorMessages.push({
                field: 'getOnly',
                message: 'getOnly should be an array of params'
            });
        }
        // getOnly does not exist
        getOnly = null;
    }

    if(req.body.match && typeof req.body.match === 'object') {
        const matchObject = req.body.match
        for(const condition in matchObject) {
            if(matchObject.hasOwnProperty(condition)) {
                const ruleExist = rules.find(rule => rule.name === condition);
                if(ruleExist) {
                    const reg = { "$regex": req.body.match[condition], "$options": "i" };
                    where = {
                        ...where,
                        [`${ruleExist.type}${ruleExist.indexNumber}`]: ruleExist.type === SHORT_STRING_FIElD_TYPE ? reg : req.body.match[condition]
                    }
                }
                else {
                    isValid = false;
                    errorMessages.push({
                        field: 'match',
                        message: `${condition} does not exist in schema`
                    });
                }
            }
        }
    }

    if (!isValid) {
        res.status(errorStatus).send({
            errors: errorMessages
        });
        return false;
    }
    return {
        where, getOnly
    };
}

// validate unique params
// TODO
async function validateUniqueParam(model: Model<any>, rules: RuleType[], reqBody: any) {
    let errorMessage: string | null = null;
    let field: string = '';

    for(let i = 0; i<=rules.length-1; i++) {
        if (rules && rules[i].unique && reqBody[rules[i].name]) {
            const exist = await model.find({[rules[i].name]: reqBody[rules[i].name]}, '_id');
            // if req body has _id and the ids match then don't check unique property
            if(reqBody && reqBody._id && exist && exist.length && reqBody._id === `${exist[0]._id}`) {
                // skip
                return;
            }
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


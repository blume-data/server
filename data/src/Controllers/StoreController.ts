import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {
    APPLICATION_NAME,
    BadRequestError,
    CLIENT_USER_NAME,
    clientType,
    EnglishLanguage,
    errorStatus,
    ID,
    okayStatus
} from "@ranjodhbirkaur/common";

import {ENTRY_CREATED_AT, ENTRY_LANGUAGE_PROPERTY_NAME, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "./Messages";
import {ModelLoggerBodyType, RuleType} from "../util/interface";
import {Model} from "mongoose";
import {DateTime} from 'luxon';
import {writeRanjodhBirData} from "../util/databaseApi";
import {
    BOOLEAN_FIElD_TYPE, DATE_AND_TIME_FIElD_TYPE,
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
    INTEGER_FIElD_TYPE, IsJsonString, JSON_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE,
    urlReg,
    UrlRegName,
    usPhoneReg,
    UsPhoneRegName,
    usZipReg,
    UsZipRegName
} from "@ranjodhbirkaur/constants";
import {createModel} from "../util/methods";

// Create Record
export async function createStoreRecord(req: Request, res: Response) {

    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME]

    // get collection
    const collection = await getCollection(req);
    if (collection) {
        const rules = JSON.parse(collection.rules);
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

                res.status(okayStatus).send(item);

                const logBody: ModelLoggerBodyType = {
                    modelName: collection.name,
                    action: "create",
                    actor: req.currentUser[ID],
                    time: `${new Date()}`,
                    [clientType]: req.currentUser[clientType],
                }

                /*Log it*/
                /*Ignore await*/
                writeRanjodhBirData(
                    `${collection.name}`,
                    collection.clientUserName,
                    collection.applicationName,
                    EnglishLanguage,
                    logBody
                );
            }
            else {
                res.status(errorStatus).send({
                    errors: [hasError]
                });
            }

        }
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Get Record
export async function getStoreRecord(req: Request, res: Response) {

    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME]

    // get collection
    const collection = await getCollection(req);
    const {limit=PER_PAGE} = req.query;
    let skip: number = (req.query && Number(req.query.skip)) || 0;

    if (collection) {
        const rules = JSON.parse(collection.rules);

        if (validateParams(req, res, rules)) {
            const {where, getOnly} = req.body;

            const model: any = createModel({
                rules,
                clientUserName,
                applicationName,
                name: collection.name
            });

            const collections = await model.find(where, getOnly).skip(skip).limit(limit);

            /*const response2 = await getRanjodhBirData(
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

            console.log('re', response2);*/
            res.status(okayStatus).send(collections);
        }
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Update Record

// Delete Record


async function getCollection(req: Request) {
    const clientUserName  = req.params && req.params[CLIENT_USER_NAME];
    const modelName = req.params && req.params.modelName;
    const applicationName = req.params && req.params[APPLICATION_NAME];

    const name = modelName;

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
function validateParams(req: Request, res: Response, rules: RuleType[]) {
    const reqBody = req.body;
    let isValid = true;
    const errorMessages = [];
    if (reqBody.where && typeof reqBody.where === 'object') {
        let where = {};
        // Iterate where
        for(const condition in reqBody.where) {
            if (reqBody.where.hasOwnProperty(condition)) {
                const ruleExist = rules.find(rule => rule.name === condition);
                if (ruleExist) {
                    if (typeof reqBody.where[condition] !== ruleExist.type) {
                        isValid = false;
                        errorMessages.push({
                            field: ruleExist.name,
                            message: `${ruleExist.name} should be of type ${ruleExist.type}`
                        });
                    }
                    else {
                        where = {
                            ...where,
                            [condition]: reqBody.where[condition]
                        }
                    }
                }
                else {
                    isValid = false;
                    errorMessages.push({
                        field: 'where',
                        message: `${condition} does not exist in schema`
                    })
                }
            }
        }

        reqBody.where = where;
    }
    if (reqBody.getOnly && (typeof reqBody.getOnly === 'object' || typeof reqBody.getOnly === 'string')) {
        if (typeof reqBody.getOnly === 'string') {
            const exist = rules.find(rule => rule.name === reqBody.getOnly);
            if (!exist) {
                isValid = false;
                errorMessages.push({
                    field: 'getOnly',
                    message: reqBody.getOnly+' does not exist in schema'
                });
            }
        }
        else {
            // if the type is object|Array
            if (reqBody.getOnly.length) {
                reqBody.getOnly.forEach((str: string) => {
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
                reqBody.getOnly = null;
            }
        }
    }
    else {
        if (reqBody.getOnly) {
            isValid = false;
            errorMessages.push({
                field: 'getOnly',
                message: 'getOnly should be an array of params to get or a string of param'
            });
        }
        // getOnly does not exist
        reqBody.getOnly = null;
    }

    if (!isValid) {
        res.status(errorStatus).send({
            errors: errorMessages
        });
        return false;
    }
    return true;
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


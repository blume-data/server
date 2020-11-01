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

import {MODEL_LOGGER_NAME, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "./Messages";
import {ModelLoggerBodyType, RuleType} from "../util/interface";
import {Model} from "mongoose";
import moment from 'moment';
import {getRanjodhBirData, writeRanjodhBirData} from "../util/databaseApi";
import {
    BOOLEAN_FIElD_TYPE,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    INTEGER_FIElD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";

// Create Record
export async function createStoreRecord(req: Request, res: Response) {

    const language = req.params.language;
    // get collection
    const collection = await getCollection(req);
    if (collection) {
        const rules = JSON.parse(collection.rules);
        let body = checkBodyAndRules(rules, req, res);
        if(body) {
            // add some alternate for unique params here
            const response = await writeRanjodhBirData(
                collection.name,
                collection.clientUserName,
                collection.connectionName,
                collection.containerName,
                collection.applicationName,
                language,
                body);

            const logBody: ModelLoggerBodyType = {
                modelName: collection.name,
                action: "create",
                actor: req.currentUser[ID],
                time: `${new Date()}`,
                [clientType]: req.currentUser[clientType],
            }

            await writeRanjodhBirData(
                `${collection.name}-${MODEL_LOGGER_NAME}`,
                collection.clientUserName,
                collection.connectionName,
                collection.containerName,
                collection.applicationName,
                EnglishLanguage,
                logBody
            )
            res.status(okayStatus).send(response);
        }
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Get Record
export async function getStoreRecord(req: Request, res: Response) {

    const language = req.params.language;

    // get collection
    const collection = await getCollection(req);
    const collectionName = req.params && req.params.modelName;
    const {limit=PER_PAGE} = req.query;
    let skip: number = (req.query && Number(req.query.skip)) || 0;

    if (collection) {
        const rules = JSON.parse(collection.rules);

        if (validateParams(req, res, rules)) {
            const {where, getOnly} = req.body;
            const response = await getRanjodhBirData(
                collectionName,
                collection.clientUserName,
                collection.connectionName,
                collection.containerName,
                collection[APPLICATION_NAME],
                language,
                {
                    skip: Number(skip),
                    limit: Number(limit),
                    where,
                    getOnly
                }
            );
            res.status(okayStatus).send(response);
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

    const name = modelName.split(`-${MODEL_LOGGER_NAME}`)[0];

    return CollectionModel.findOne(
        {clientUserName, name, applicationName},
        ['name', CLIENT_USER_NAME, 'connectionName', 'containerName', APPLICATION_NAME, 'rules']
        );
}

function checkBodyAndRules(rules: RuleType[], req: Request, res: Response) {

    const reqBody = req.body;
    let body = {
        created_at: new Date()
    };
    let isValid = true;
    const errorMessages: {field: string, message: string}[] = [];

    rules.forEach((rule) => {
        // check for required params
        if ((!reqBody[rule.name] && rule.required)) {
            isValid = false;
            errorMessages.push({
                field: rule.name,
                message: `${rule.name} is required`
            });
        }
        // check the types
        if (reqBody[rule.name]) {

            const type = typeof reqBody[rule.name];
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
                    break;
                }
                case 'date': {
                    if (typeof reqBody[rule.name] !== 'string') {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be of type string`
                        });
                    }
                    else {
                        const date = moment(reqBody[rule.name],'YYYY/MM/DD hh:mm:ss').format();
                        const timestamp = Date.parse(date);
                        if (!isNaN(timestamp)) {
                            reqBody[rule.name] = new Date(timestamp);
                        }
                        else {
                            isValid = false;
                            errorMessages.push({
                                field: rule.name,
                                message: `${rule.name} is not a valid date`
                            });
                        }
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
                body = {
                    ...body,
                    [rule.name] : rule.default
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


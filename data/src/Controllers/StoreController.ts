import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {errorStatus, okayStatus, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND, PARAM_SHOULD_BE_UNIQUE} from "./Messages";
import {RuleType} from "../util/interface";
import {Model} from "mongoose";
import moment from 'moment';
import {getRanjodhBirData, writeRanjodhBirData} from "../util/databaseApi";

// Create Record
export async function createStoreRecord(req: Request, res: Response) {

    // get collection
    const collection = await getCollection(req);
    if (collection) {
        const rules = JSON.parse(collection.rules);
        const body = checkBodyAndRules(rules, req, res);
        // add some alternate for unique params here
        const response = await writeRanjodhBirData(collection.name, collection.clientUserName, collection.connectionName, body);
        res.status(okayStatus).send(response);
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Get Record
export async function getStoreRecord(req: Request, res: Response) {

    // get collection
    const collection = await getCollection(req);
    const {perPage=PER_PAGE} = req.query;
    let pageNo: number = (req.query && Number(req.query.pageNo)) ? Number(req.query.pageNo) : 1;

    if (collection) {
        const rules = JSON.parse(collection.rules);

        if (validateParams(req, res, rules)) {
            const {where, getOnly} = req.body;
            const response = await getRanjodhBirData(collection.name, collection.clientUserName, collection.connectionName,{
                pageNo: Number(pageNo),
                perPage: Number(perPage),
                where,
                getOnly
            });
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
    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;
    const collectionName = req.params && req.params.collectionName;

    return CollectionModel.findOne({clientUserName: userName, name: collectionName, language},
        ['clientUserName', 'connectionName', 'name', 'rules']);
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
                case 'string': {
                    if (!['string','number'].includes(type)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be of type ${rule.type}`
                        });
                    }
                    else {
                        reqBody[rule.name]=String(reqBody[rule.name]);
                    }
                    break;
                }
                case 'number': {
                    if (!['string', 'number'].includes(type)) {
                        isValid = false;
                        errorMessages.push({
                            field: rule.name,
                            message: `${rule.name} should be of type ${rule.type}`
                        });
                    }
                    else {
                        reqBody[rule.name] = Number(reqBody[rule.name]);
                    }
                    break;
                }
                case 'boolean': {
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
                // add id in where as it is not in the schema
                if (condition === 'id') {
                    where = {
                        ...where,
                        [condition]: reqBody.where[condition]
                    };
                }
                else {
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


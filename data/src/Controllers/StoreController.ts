import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {createModel} from "../util/methods";
import {errorStatus, okayStatus, PER_PAGE} from "../util/constants";
import {COLLECTION_NOT_FOUND} from "./Messages";

// Create Record
export async function createStoreRecord(req: Request, res: Response) {

    // get collection
    const collection = await getCollection(req);
    if (collection) {
        const rules = JSON.parse(collection.rules);
        let body = checkBodyAndRules(rules, req);

        const model = createModel({
            rules,
            connectionName: collection.connectionName,
            dbName: collection.dbName,
            name: collection.name
        });

        const item = new model(body);
        await item.save();

        res.status(okayStatus).send(item);

    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

// Get Record
export async function getStoreRecord(req: Request, res: Response) {

    // get collection
    const collection = await getCollection(req);
    const {pageNo, perPage=PER_PAGE} = req.query;
    if (collection) {
        const rules = JSON.parse(collection.rules);

        if (validateParams(req, res, rules)) {
            const {where, getOnly} = req.body;
            const model = createModel({
                rules,
                connectionName: collection.connectionName,
                dbName: collection.dbName,
                name: collection.name
            });

            const collections = await model.find(where, getOnly);
            
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
    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;
    const collectionName = req.params && req.params.collectionName;

    return CollectionModel.findOne({userName, name: collectionName, language});
}

function checkBodyAndRules(rules: {type: string; name: string}[], req: Request) {

    const reqBody = req.body;
    let body = {};
    let isValid = true;
    const inValidMessage = [];

    rules.forEach((rule) => {
        if (!reqBody[rule.name] || typeof reqBody[rule.name] !== rule.type) {
            isValid = false;
            inValidMessage.push({
                field: rule.name,
                message: `${rule.name} is required`
            });
        }
        else {
            body = {
                ...body,
                [rule.name] : reqBody[rule.name]
            };
        }
    });
    if (isValid) {
        return body;
    }
    else {
        throw new BadRequestError('Error in request body');
    }
}

function validateParams(req: Request, res: Response, rules: {name: string; type: string}[]) {
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


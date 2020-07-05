import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {createModel} from "../util/methods";
import {okayStatus} from "../util/constants";
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
    if (collection) {
        const rules = JSON.parse(collection.rules);
        const model = createModel({
            rules,
            connectionName: collection.connectionName,
            dbName: collection.dbName,
            name: collection.name
        });

        const collections = await model.find({});
        res.status(okayStatus).send(collections);
    }
    else {
        throw new BadRequestError(COLLECTION_NOT_FOUND);
    }
}

async function getCollection(req: Request) {
    const userName  = req.params && req.params.userName;
    const collectionName = req.params && req.params.collectionName;

    return CollectionModel.findOne({userName, name: collectionName});
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


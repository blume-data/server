import {Request, Response} from 'express';
import {BadRequestError, okayStatus} from "@ranjodhbirkaur/common";
import {
    DATA_COLLECTION, MAX_COLLECTION_LIMIT, STORE_CONNECTIONS, USER_COLLECTION
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT, COLLECTION_ALREADY_EXIST} from "./Messages";
import {RuleType} from "../util/interface";
import {storeSchema} from "../util/databaseApi";
import {RANDOM_COLLECTION_NAME} from "../util/methods";

export async function createCollectionSchema(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;

    const reqBody = req.body;

    const isInLimit = await CollectionModel.find({
        clientUserName
    },'name');
    if ((isInLimit && isInLimit.length) > MAX_COLLECTION_LIMIT) {
        throw new BadRequestError(CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT);
    }

    // the name of the custom schema collection should not contain any space
    if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
        const name = reqBody.name.split(' ').join('_');
        if (reqBody.collectionType && reqBody.collectionType === USER_COLLECTION) {
            const hasEmail = reqBody.rules.find((rule: RuleType) => rule.name === 'email');
            if (!hasEmail) {
                reqBody.rules.push({
                    name: 'email',
                    type: 'string',
                    unique: true,
                    required: true,
                    isEmail: true
                });
            }
            const hasPassword = reqBody.rules.find((rule: RuleType) => rule.name === 'password');
            if (!hasPassword) {
                reqBody.rules.push({
                    name: 'password',
                    type: 'string',
                    required: true,
                    isPassword: true
                });
            }
        }
        reqBody.name = name;
    }

    // Check if there is not other collection with same name and user_id
    const alreadyExist = await CollectionModel.findOne({
        clientUserName, name: reqBody.name, env
    }, 'id');

    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    const containerName = `${RANDOM_COLLECTION_NAME(1, 1000)}`;
    const storeConnection = _.sample(STORE_CONNECTIONS);
    const connectionName = (storeConnection && storeConnection.url) ? storeConnection.url : '';
    const newCollection = CollectionModel.build({
        clientUserName,
        isPublic: false,
        applicationName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        env,
        connectionName,
        containerName,
        collectionType: (reqBody.collectionType ? reqBody.collectionType : DATA_COLLECTION),
        language
    });

    await storeSchema(reqBody.name, clientUserName, connectionName, containerName);
    await newCollection.save();

    res.status(okayStatus).send(newCollection);
}

export async function getCollectionNames(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;

    const collections = await CollectionModel.find({
        clientUserName,
        applicationName,
        language,
        env
    }, 'name');
    res.status(okayStatus).send(collections);
}

export async function deleteCollectionSchema(req: Request, res: Response) {
    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;

    const reqBody = req.body;

    const itemSchema = await CollectionModel.findOne({
        clientUserName: userName,
        name: reqBody.name,
        language
    });

    if (itemSchema) {
        await CollectionModel.deleteOne({
            userName: userName,
            name: reqBody.name
        });

    }
    else {
        throw new BadRequestError('Collection not found');
    }
    res.status(okayStatus).send(true);
}

export async function getCollectionSchema(req: Request, res: Response) {
    
    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;

    const reqBody = req.body;

    const collections = await CollectionModel.find({userName, language});
    res.status(okayStatus).send(collections);
}


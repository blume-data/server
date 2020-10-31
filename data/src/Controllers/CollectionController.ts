import {Request, Response} from 'express';
import {BadRequestError, ID, okayStatus, sendSingleError, USER_NAME} from "@ranjodhbirkaur/common";
import {
    MAX_COLLECTION_LIMIT, MODEL_LOGGER_NAME, STORE_CONNECTIONS
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT, COLLECTION_ALREADY_EXIST} from "./Messages";

import {storeSchema} from "../util/databaseApi";
import {RANDOM_COLLECTION_NAME} from "../util/methods";
import {trimCharactersAndNumbers} from "@ranjodhbirkaur/constants";

export async function createCollectionSchema(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const env = req.params && req.params.env;
    const reqMethod = req.method;

    const reqBody = req.body;

    if(reqMethod === 'POST') {
        /*If in create mode*/
        /*Check collection limit*/
        const isInLimit = await CollectionModel.find({
            clientUserName
        },'name');
        if ((isInLimit && isInLimit.length) > MAX_COLLECTION_LIMIT) {
            throw new BadRequestError(CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT);
        }

        // the name of the custom schema collection should not contain any space
        if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
            reqBody.name = trimCharactersAndNumbers(reqBody.name);
        }

        // Check if there is not other collection with same name and user_id
        const alreadyExist = await CollectionModel.findOne({
            clientUserName, name: reqBody.name, env, applicationName
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
            displayName: reqBody.displayName,
            env,
            connectionName,
            updatedBy: `${req.currentUser[ID]}-${req.currentUser[USER_NAME]}`,
            description: reqBody.description,
            containerName
        });

        const store = await storeSchema(reqBody.name, clientUserName, connectionName, containerName, applicationName);
        const storeTwo = await storeSchema(`${reqBody.name}-${MODEL_LOGGER_NAME}`, clientUserName, connectionName, containerName, applicationName);
        const nreCollection = await newCollection.save();

        res.status(okayStatus).send(newCollection);
    }
    else {

        const exist = await CollectionModel.findOne({
            _id: reqBody.id
        },
            ['name', 'displayName', 'description', 'rules']);

        if(exist) {
            const update: any = {};
            if(reqBody.rules) {
                update.rules = JSON.stringify(reqBody.rules);
            }
            if(reqBody.description) {
                update.description = reqBody.description;
            }
            if(reqBody.displayName) {
                update.displayName = reqBody.displayName;
            }

            await CollectionModel.findOneAndUpdate({
                _id: reqBody.id
            }, update);

            return res.status(okayStatus).send('done');

        }
        else {
            return sendSingleError(res, 'Model not foundc');
        }
    }
}

/*Return the list of collections in an application name*/
export async function getCollectionNames(req: Request, res: Response) {

    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;
    const name = req.query.name;
    const where: any = {
        clientUserName,
        applicationName,
        language,
        env
    };
    const get: string[] = ['rules'];

    if(name) {
        where.name = name;
    }
    else {
        get.push('name');
        get.push('description');
        get.push('updatedAt');
        get.push('updatedBy');
        get.push('displayName')
    }

    const collections = await CollectionModel.find(where, get);

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


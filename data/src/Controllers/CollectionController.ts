import {Request, Response} from 'express';
import {BadRequestError, ID, okayStatus, sendSingleError, USER_NAME} from "@ranjodhbirkaur/common";
import {
    MAX_COLLECTION_LIMIT,
    MAX_USER_LIMIT,
    RANJODHBIR_KAUR_DATABASE_URL,
} from "../util/constants";
import {CollectionModel} from "../models/Collection";
import {
    ALL_CONNECTIONS_AND_DB_CAPACITY_FULL,
    CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT,
    COLLECTION_ALREADY_EXIST
} from "./Messages";

import {storeSchema} from "../util/databaseApi";
import {trimCharactersAndNumbers} from "@ranjodhbirkaur/constants";
import {createModel} from "../util/methods";

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

        const newCollection = CollectionModel.build({
            clientUserName,
            isPublic: false,
            applicationName,
            rules: JSON.stringify(reqBody.rules),
            name: reqBody.name,
            displayName: reqBody.displayName,
            env,
            updatedBy: `${req.currentUser[ID]}-${req.currentUser[USER_NAME]}`,
            description: reqBody.description
        });

        await storeSchema(`${reqBody.name}`, clientUserName, applicationName);
        await newCollection.save();

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
            return sendSingleError(res, 'Model not found');
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
    const clientUserName  = req.params && req.params.clientUserName;
    const applicationName  = req.params && req.params.applicationName;
    const env = req.params && req.params.env;

    const reqBody = req.body;

    const itemSchema = await CollectionModel.findOne({
        clientUserName,
        name: reqBody.name,
        applicationName,
        env
    }, ['rules', 'name']);

    if (itemSchema) {
        await CollectionModel.deleteOne({
            clientUserName,
            name: reqBody.name,
            applicationName,
            env
        });

        const parsedRules = JSON.parse(itemSchema.rules);

        const model: any = createModel({
            rules: parsedRules,
            name: itemSchema.name,
            applicationName,
            clientUserName
        });

        await model.remove({});

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


/*
/!*Helper methods*!/
async function assignConnection(clientUserName: string) : Promise<any> {

    const userConnectionExist = await UserConnectionModel.findOne({
        clientUserName: clientUserName
    }, ['connectionName', 'clientUserName']);

    if(userConnectionExist) {
        return {
            connectionName: userConnectionExist.connectionName
        };
    }
    else {
        // Search a connection with count less the max users per connection
        const availableConnection = await ConnectionModel.findOne({count: {$lte: MAX_USER_LIMIT}}, ['name', 'count']);
        const allConnections = await ConnectionModel.find({});
        if (!availableConnection && !allConnections.length) {
            // create a new connection
            return await createNewConnection(allConnections.length, clientUserName);
        }
        else if(availableConnection) {
            // assign a new connection and increase count
            return await incrementConnectionCount(availableConnection.name, availableConnection.count, clientUserName);
        }
        else if(allConnections.length <= MONGO_DB_DATA_CONNECTIONS_AVAILABLE.length) {
            // create a new connection
            return await createNewConnection(allConnections.length, clientUserName);
        }
        else {
            throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL+' : while creating a new connection');
        }
    }
}

async function incrementConnectionCount(connectionName: string, count: number, clientUserName: string) {
    const newUserConnection = UserConnectionModel.build({
        clientUserName: clientUserName, connectionName
    });
    await newUserConnection.save();
    await ConnectionModel.updateOne({name: connectionName}, {count: count + 1});
    return {
        connectionName
    };
}

async function createNewConnection(allConnectionsLength: number, clientUserName: string) {
    const connectionName = MONGO_DB_DATA_CONNECTIONS_AVAILABLE[allConnectionsLength];
    if (connectionName) {
        const newUserConnection = UserConnectionModel.build({
            clientUserName: clientUserName, connectionName
        });
        await newUserConnection.save();
        const newConnection = ConnectionModel.build({ name: connectionName, count: 1, type: 'connection_type' });
        await newConnection.save();
        return {
            connectionName: newConnection.name
        }
    }
    else {
        throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL);
    }
}*/

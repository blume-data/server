import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {
    ALL_CONNECTIONS_AND_DB_CAPACITY_FULL, DATA_COLLECTION, MAX_COLLECTION_LIMIT,
    MAX_USER_LIMIT, MONGO_DB_DATA_CONNECTIONS_AVAILABLE,
    okayStatus, USER_COLLECTION
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {CANNOT_CREATE_COLLECTIONS_MORE_THAN_LIMIT, COLLECTION_ALREADY_EXIST} from "./Messages";
import {ConnectionModel} from "../models/Connections";
import {UserConnectionModel} from "../models/UserConnection";
import {RuleType} from "../util/interface";

export async function createCollectionSchema(req: Request, res: Response) {

    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;
    const env = req.params && req.params.env;

    const reqBody = req.body;

    const isInLimit = await CollectionModel.find({
        clientUserName: userName
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
        clientUserName: userName, name: reqBody.name, env
    }, 'id');

    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    const newDbConnection: {connectionName: string} = await assignConnection(userName);

    if (newDbConnection) {
        const newCollection = CollectionModel.build({
            clientUserName: userName,
            isPublic: false,
            applicationName: 'some name',
            rules: JSON.stringify(reqBody.rules),
            name: reqBody.name,
            env,
            connectionName: newDbConnection.connectionName,
            collectionType: (reqBody.collectionType ? reqBody.collectionType : DATA_COLLECTION),
            language
        });

        await newCollection.save();

        res.status(okayStatus).send(newCollection);
    }
    else {
        res.status(500).send('Db capacity full');
    }
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
        /*await DbsModel.deleteOne({
            name: userName
        });
        // calculate the exact length of the dbs
        const dbs = await DbsModel.find({connectionName: itemSchema.connectionName}, 'id');
        await ConnectionModel.updateOne({name: itemSchema.connectionName}, {count: dbs.length});*/
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
}


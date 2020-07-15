import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {
    ALL_CONNECTIONS_AND_DB_CAPACITY_FULL, COLLECTION_TYPES, DATA_COLLECTION,
    errorStatus,
    MAX_COLLECTION_LIMIT,
    MAX_DB_LIMIT,
    MONGO_DB_DATA_CONNECTIONS_AVAILABLE, okayStatus,
    SUPPORTED_DATA_TYPES, USER_COLLECTION
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {
    COLLECTION_ALREADY_EXIST,
    DEFAULT_VALUE_SHOULD_BE_OF_SPECIFIED_TYPE, EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING,
    INVALID_RULES_MESSAGE,
    IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN, PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "./Messages";
import {ConnectionModel} from "../models/Connections";
import {DbsModel} from "../models/Dbs";
import {RuleType} from "../util/interface";
import {validateEnvType} from "../util/enviornmentTypes";

export async function createCollectionSchema(req: Request, res: Response) {

    const userName  = req.params && req.params.userName;
    const language = req.params && req.params.language;

    const reqBody = req.body;

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
        userName: userName, name: reqBody.name, env: reqBody.env
    }, 'id');

    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    const newDbConnection = await assignConnectionAndDb(userName);

    if (newDbConnection) {
        const newCollection = CollectionModel.build({
            userName: userName,
            rules: JSON.stringify(reqBody.rules),
            name: reqBody.name,
            env: reqBody.env,
            dbName: newDbConnection.name,
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

    const reqBody = req.body;

    const itemSchema = await CollectionModel.findOne({
        userName: userName,
        name: reqBody.name,
        language
    });

    if (itemSchema) {
        await CollectionModel.deleteOne({
            userName: userName,
            name: reqBody.name
        });
        // calculate the exact length of the dbs
        const dbs = await DbsModel.find({connectionName: itemSchema.connectionName}, 'id');
        await ConnectionModel.updateOne({name: itemSchema.connectionName}, {count: dbs.length});
        // update the count on db
        const db = await DbsModel.findOne({
            connectionName: itemSchema.connectionName,
            name: itemSchema.dbName
        }, 'count');
        if (db) {
            await DbsModel.updateOne({
                connectionName: itemSchema.connectionName,
                name: itemSchema.dbName
            }, {
                count: db.count - 1
            });
        }

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

async function assignConnectionAndDb(username: string) : Promise<any> {

    const connections = await ConnectionModel.findOne({count: {$lte: MAX_DB_LIMIT}}, ['name', 'count']);
    const allConnections = await ConnectionModel.find({}, 'id');

    if (!connections && !allConnections.length) {
        // create a new connection
        return await createNewConnection(allConnections.length, username);
    }
    else if(connections) {
        const dbs = await DbsModel.findOne({connectionName: connections.name, name: username, count: {$lte: MAX_COLLECTION_LIMIT}});
        const allDbs = await DbsModel.find({connectionName: connections.name}, 'id');
        if(!dbs && !allDbs.length) {
            // create new db here
            await incrementConnectionCount(connections.name, connections.count);
            const newDb = DbsModel.build({connectionName: connections.name, count: 1, name: username });
            return await newDb.save();
        }
        else if (!dbs) {
            // all dbs capacity is full create a new db
            if (allDbs.length === MAX_DB_LIMIT) {
                // HACK HACK HACK
                // on delete of any collection: update the count of connection to the length of dbs
                await incrementConnectionCount(connections.name, connections.count);
                return await createNewConnection(allConnections.length, username);
            }
            else{
                await incrementConnectionCount(connections.name, connections.count);
                const newDb = DbsModel.build({connectionName: connections.name, count: 1, name: username });
                return await newDb.save();
            }
        }
        else if(dbs) {
            await DbsModel.updateOne({connectionName:dbs.connectionName, name: dbs.name}, {count: dbs.count + 1});
            return dbs;
        }
    }
    else if(allConnections.length <= MONGO_DB_DATA_CONNECTIONS_AVAILABLE.length) {
        return await createNewConnection(allConnections.length, username);
    }
    else {
        throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL+' : while creating DB');
    }
}

async function incrementConnectionCount(connectionName: string, count: number) {
    await ConnectionModel.updateOne({name: connectionName}, {count: count + 1});
}

async function createNewConnection(allConnectionsLength: number, name: string) {
    const connectionName = MONGO_DB_DATA_CONNECTIONS_AVAILABLE[allConnectionsLength];
    if (connectionName) {
        const newConnection = ConnectionModel.build({ name: connectionName, count: 1 });
        await newConnection.save();
        const newDb = DbsModel.build({ connectionName, name, count: 1 });
        return await newDb.save();
    }
    else {
        throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL);
    }
}


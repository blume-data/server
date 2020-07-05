import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {
    ALL_CONNECTIONS_AND_DB_CAPACITY_FULL,
    errorStatus,
    MAX_COLLECTION_LIMIT,
    MAX_DB_LIMIT,
    MONGO_DB_DATA_CONNECTIONS_AVAILABLE, okayStatus,
    SUPPORTED_DATA_TYPES
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {
    COLLECTION_ALREADY_EXIST,
    INVALID_RULES_MESSAGE,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "./Messages";
import {ConnectionModel} from "../models/Connections";
import {DbsModel} from "../models/Dbs";

export async function createCollectionSchema(req: Request, res: Response) {

    const userName  = req.params && req.params.userName;

    const reqBody = req.body;

    let isValidBody = true;

    // the name of the custom schema collection should not contain any space
    if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
        reqBody.name = reqBody.name.split(' ').join('_');
    }

    // Check if there is not other collection with same name and user_id
    const alreadyExist = await CollectionModel.findOne({
        userName: userName, name: reqBody.name
    }, 'id');
    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    let inValidMessage = [];

    // Validate Rules
    if (reqBody.rules && typeof reqBody.rules === 'object' && reqBody.rules.length) {
        reqBody.rules.forEach((rule: {type: string, required?: boolean, name: string}) => {
            // Check required property
            if (rule.required !== undefined && typeof rule.required !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`
                });
            }
            // Validate rule type
            if (typeof rule.type === 'string' && SUPPORTED_DATA_TYPES.includes(rule.type)) {
                // remove all the spaces from name
                rule.name = rule.name.split(' ').join('_');
            }

            else {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name} should have valid type`
                });
            }
        });
    }
    else {
        isValidBody = false;
        inValidMessage.push({
            message: INVALID_RULES_MESSAGE,
            field: 'rules'
        })
    }

    if (!isValidBody) {
        return res.status(errorStatus).send({
            errors: inValidMessage
        });
    }
    const newDbConnection = await assignConnectionAndDb();

    const newCollection = CollectionModel.build({
        userName: userName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        dbName: newDbConnection.name,
        connectionName: newDbConnection.connectionName
    });

    await newCollection.save();

    res.status(200).send(newCollection);
}

export async function deleteCollectionSchema(req: Request, res: Response) {
    const userName  = req.params && req.params.userName;

    const reqBody = req.body;

    const itemSchema = await CollectionModel.findOne({
        userName: userName,
        name: reqBody.name
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

    const reqBody = req.body;

    const collections = await CollectionModel.find({userName});
    res.status(okayStatus).send(collections);
}

async function assignConnectionAndDb() : Promise<any> {

    const connections = await ConnectionModel.findOne({count: {$lte: MAX_DB_LIMIT}}, ['name', 'count']);
    const allConnections = await ConnectionModel.find({}, 'id');

    if (!connections && !allConnections.length) {
        // create a new connection
        return await createNewConnection(allConnections.length);
    }
    else if(connections) {
        const dbs = await DbsModel.findOne({connectionName: connections.name, count: {$lte: MAX_COLLECTION_LIMIT}});
        const allDbs = await DbsModel.find({connectionName: connections.name}, 'id');
        if(!dbs && !allDbs.length) {
            // create new db here
            await incrementConnectionCount(connections.name, connections.count);
            const newDb = DbsModel.build({connectionName: connections.name, count: 1, name: '_1' });
            return await newDb.save();
        }
        else if (!dbs) {
            // all dbs capacity is full create a new db
            if (allDbs.length === MAX_DB_LIMIT) {
                // HACK HACK HACK
                // on delete of any collection: update the count of connection to the length of dbs
                await incrementConnectionCount(connections.name, connections.count);
                return await createNewConnection(allConnections.length);
            }
            else{
                await incrementConnectionCount(connections.name, connections.count);
                const newDb = DbsModel.build({connectionName: connections.name, count: 1, name: `_${allDbs.length + 1}` });
                return await newDb.save();
            }
        }
        else if(dbs) {
            await DbsModel.updateOne({connectionName:dbs.connectionName, name: dbs.name}, {count: dbs.count + 1});
            return dbs;
        }
    }
    else if(allConnections.length <= MONGO_DB_DATA_CONNECTIONS_AVAILABLE.length) {
        return await createNewConnection(allConnections.length);
    }
    else {
        throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL+' : while creating DB');
    }
}

async function incrementConnectionCount(connectionName: string, count: number) {
    await ConnectionModel.updateOne({name: connectionName}, {count: count + 1});
}

async function createNewConnection(allConnectionsLength: number) {
    const connectionName = MONGO_DB_DATA_CONNECTIONS_AVAILABLE[allConnectionsLength];
    if (connectionName) {
        const newConnection = ConnectionModel.build({ name: connectionName, count: 1 });
        await newConnection.save();
        const newDb = DbsModel.build({ connectionName, name: '_1', count: 1 });
        return await newDb.save();
    }
    else {
        throw new Error(ALL_CONNECTIONS_AND_DB_CAPACITY_FULL);
    }
}

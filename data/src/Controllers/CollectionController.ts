import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {
    errorStatus,
    MAX_COLLECTION_LIMIT,
    MAX_DB_LIMIT,
    MONGO_DB_DATA_CONNECTIONS_AVAILABLE,
    SUPPORTED_DATA_TYPES
} from "../util/constants";
import _ from 'lodash';
import {CollectionModel} from "../models/Collection";
import {
    COLLECTION_ALREADY_EXIST,
    INVALID_RULES_MESSAGE,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "./Messages";
import {createRecord} from "../services/crudMethods";
import {ConnectionModel} from "../models/Connections";
import {DbsModel} from "../models/Dbs";

export async function createItemSchema(req: Request, res: Response) {

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

    const connectionName = _.sample(MONGO_DB_DATA_CONNECTIONS_AVAILABLE);
    const newDbCollection = await assignConnectionAndDb();


    //console.log('newDbCollection', newDbCollection);

    const data = {
        userName: userName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        dbName: newDbCollection.name,
        connectionName: newDbCollection.connectionName
    };

    const newCollection = CollectionModel.build({
        userName: userName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        dbName: newDbCollection.name,
        connectionName: newDbCollection.connectionName
    });
    await newCollection.save();

    res.status(200).send(newCollection);
    //createMethod(res, data, CollectionModel);
}

async function assignConnectionAndDb(searchedConnections?: string[]) : Promise<any> {

    const connections = await ConnectionModel.findOne({count: {$lt: MAX_DB_LIMIT}});
    console.log('limited connections', connections);
    const allConnections = await ConnectionModel.find({}, 'id');
    console.log('all connections', allConnections);

    if (!connections && !allConnections.length) {
        // create a new connection
        const connectionName = MONGO_DB_DATA_CONNECTIONS_AVAILABLE[0];
        const newConnection = ConnectionModel.build({ name: connectionName, count: 1 });
        await newConnection.save();
        console.log('new connection created', newConnection);
        const newDb = DbsModel.build({ connectionName, name: '_1', count: 1 });
        return await newDb.save();
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
            await incrementConnectionCount(connections.name, connections.count);
            const newDb = DbsModel.build({connectionName: connections.name, count: 1, name: `_${allDbs.length + 1}` });
            return await newDb.save();
        }
        else if(dbs) {
            return dbs;
        }
    }
    else {
        throw new Error('Need another connection');
    }
}

async function incrementConnectionCount(connectionName: string, count: number) {
    await ConnectionModel.update({name: connectionName}, {count: count + 1});
}



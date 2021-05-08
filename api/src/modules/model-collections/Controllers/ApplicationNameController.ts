import {
    APPLICATION_NAMES,
    ID,
    okayStatus,
    sendSingleError
} from '@ranjodhbirkaur/common';
import {Request, Response} from 'express';
import {APPLICATION_NAME_ALREADY_EXIST} from "./Messages";
import {
    JSON_FIELD_TYPE,
    PRODUCTION_ENV,
    SHORT_STRING_FIElD_TYPE,
    trimCharactersAndNumbers
} from "@ranjodhbirkaur/constants";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../../../db-models/ApplicationSpace";
import {CollectionModel} from "../../../db-models/Collection";

interface OnEnvCreate {
    clientUserName: string;
    applicationName: string;
    env: string;
    userId: string;
}

export async function onEnvCreate(data: OnEnvCreate) {

    const {clientUserName, applicationName, env, userId} = data;
    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const newCollection = CollectionModel.build({
        clientUserName,
        isPublic: false,
        applicationName,
        rules: JSON.stringify([
            {name: 'title', displayName: 'Title', description: 'Title of query', type: SHORT_STRING_FIElD_TYPE, required: true, unique: true},
            {name: 'description', displayName: 'Description', description: 'Description of query', type: SHORT_STRING_FIElD_TYPE},
            {name: 'data', displayName: 'Data', description: 'Data of query', type: JSON_FIELD_TYPE, required: true}
        ]),
        name: 'applicationQueries',
        displayName: 'Application queries',
        env,
        updatedBy: userId,
        description: 'this model consist of queries',
        createdAt,
        createdBy: userId,
        updatedAt: createdAt,
        titleField: 'title'
    });

    await newCollection.save();
}

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName, description='', hasQueryModel=false} = req.body;
    const {clientUserName} = req.params;
    const lowerCaseApplicationName = trimCharactersAndNumbers(applicationName);

    const alreadyExist = await ApplicationSpaceModel.findOne({
        clientUserId: req.currentUser[ID],
        name: lowerCaseApplicationName
    });

    if(alreadyExist) {
        return sendSingleError(res, APPLICATION_NAME_ALREADY_EXIST);
    }
    else {
        const createdAt = DateTime.local().setZone('UTC').toJSDate();
        const newApplicationSpace = ApplicationSpaceModel.build({
            clientUserId: req.currentUser[ID],
            name: lowerCaseApplicationName,
            env: [PRODUCTION_ENV],
            updatedBy: req.currentUser[ID],
            description,
            hasQueryModel,
            createdAt,
            createdBy: req.currentUser[ID],
            updatedAt: createdAt
        });

        // create Env Production
        await onEnvCreate({
            clientUserName,
            applicationName,
            env: PRODUCTION_ENV,
            userId: req.currentUser[ID]
        });

        await newApplicationSpace.save();
        return res.status(okayStatus).send(lowerCaseApplicationName);
    }
        
}

export async function getApplicationName(req: Request, res: Response) {

    const applicationNames = await ApplicationSpaceModel.find({
        clientUserId: req.currentUser[ID],
    }, ['name', 'env']);
    return res.status(okayStatus).send({[APPLICATION_NAMES]: applicationNames});
}
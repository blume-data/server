import {
    APPLICATION_NAMES,
    ID,
    okayStatus,
    sendSingleError
} from '../../../util/common-module';
import {Request, Response} from 'express';
import {APPLICATION_NAME_ALREADY_EXIST} from "../../../util/Messages";
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
    console.log('On event ENV create');
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
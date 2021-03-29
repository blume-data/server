import {
    APPLICATION_NAMES,
    ApplicationNameType,
    EnglishLanguage, ID,
    okayStatus,
    sendSingleError,
    USER_NAME
} from '@ranjodhbirkaur/common';
import {Request, Response} from 'express';
import {ClientUserModel} from "../authMongoConnection";
import {APPLICATION_NAME_ALREADY_EXIST} from "./Messages";
import {PRODUCTION_ENV, trimCharactersAndNumbers} from "@ranjodhbirkaur/constants";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../models/ApplicationSpace";

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName, description=''} = req.body;
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
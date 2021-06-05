import {
    APPLICATION_NAMES,
    ID,
    okayStatus,
    sendSingleError
} from '../../../util/common-module';
import {Request, Response} from 'express';
import {APPLICATION_NAME_ALREADY_EXIST} from "../../../util/Messages";
import {
    PRODUCTION_ENV,
    trimCharactersAndNumbers
} from "@ranjodhbirkaur/constants";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../../../db-models/ApplicationSpace";
import { EnvModel } from '../../../db-models/Env';
import {v4} from 'uuid';
import { flatObject } from '../../../util/methods';

interface NewApplicationSpace {
    res?: Response;
    userId: string;
    applicationName: string;
    description: string;
    clientUserName: string;
}

export async function newApplicationSpace(params: NewApplicationSpace) {

    const {applicationName, res, userId, description, clientUserName} = params;

    const lowerCaseApplicationName = trimCharactersAndNumbers(applicationName);

    const alreadyExist = await ApplicationSpaceModel.findOne({
        clientUserName,
        name: lowerCaseApplicationName
    });

    if(alreadyExist && res) {
        return sendSingleError(res, APPLICATION_NAME_ALREADY_EXIST);
    }
    else {
        const createdAt = DateTime.local().setZone('UTC').toJSDate();

        //create a new production env for this
        const newEnv = EnvModel.build({
            name: PRODUCTION_ENV,
            applicationName,
            clientUserName,
            description,
            order: 1,
            id: v4(),
            updatedById: userId,
            createdAt,
            createdById: userId,
            updatedAt: createdAt,
            isPublic: true,
            supportedDomains: ['']
        });

        await newEnv.save();

        const newApplicationSpace = ApplicationSpaceModel.build({
            clientUserName,
            name: lowerCaseApplicationName,
            id: v4(),
            envId: [newEnv.id],
            updatedBy: userId,
            description,
            createdAt,
            createdBy: userId,
            updatedAt: createdAt
        });

        await newApplicationSpace.save();
        if(res) {
            return res.status(okayStatus).send(lowerCaseApplicationName);
        }
}
}

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName, description='', hasQueryModel=false} = req.body;
    const {clientUserName} = req.params;
    
    return await newApplicationSpace({
        applicationName, res, userId: req.currentUser[ID],
        clientUserName, description
    });
}

export async function getApplicationName(req: Request, res: Response) {

    const clientUserName = req.params.clientUserName;

    const items = await ApplicationSpaceModel
    .find({
        clientUserName: clientUserName,
    }, ['name', 'envId', 'id', 'description'])
    .populate('env', ['name', 'description', 'order', 'isPublic', 'supportedDomains']);

    const applicationNames = flatObject(items, {envId: undefined});

    return res.status(okayStatus).send({[APPLICATION_NAMES]: applicationNames});
}
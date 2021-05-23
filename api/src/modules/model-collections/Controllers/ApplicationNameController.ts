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
            description,
            order: 1,
            updatedBy: userId,
            createdAt,
            createdBy: userId,
            updatedAt: createdAt,
            isPublic: true,
            supportedDomains: ['']
        });

        await newEnv.save();

        const newApplicationSpace = ApplicationSpaceModel.build({
            clientUserName,
            name: lowerCaseApplicationName,
            env: [newEnv[ID]],
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

    const applicationNames = await ApplicationSpaceModel
    .find({
        clientUserName: clientUserName,
    }, ['name', 'env'])
    .populate('env', ['name', 'description', 'order', 'isPublic', 'supportedDomains'])
    ;
    return res.status(okayStatus).send({[APPLICATION_NAMES]: applicationNames});
}
import {
    APPLICATION_NAMES,
    ApplicationNameType,
    EnglishLanguage,
    okayStatus,
    sendSingleError,
    USER_NAME
} from '@ranjodhbirkaur/common';
import {Request, Response} from 'express';
import {ClientUserModel} from "../authMongoConnection";
import {APPLICATION_NAME_ALREADY_EXIST} from "./Messages";

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName} = req.body;
    const lowerCaseApplicationName = applicationName.toLowerCase().split(' ').join('-');

    if(req.currentUser && req.currentUser[APPLICATION_NAMES] && typeof req.currentUser[APPLICATION_NAMES]) {
        const applicationNames: ApplicationNameType[] = req.currentUser[APPLICATION_NAMES];


        const exist = applicationNames.find((item) => {
            return item.name === lowerCaseApplicationName
        });

        if (!exist) {
            applicationNames.push({
                name: lowerCaseApplicationName,
                languages: [EnglishLanguage]
            });

            await ClientUserModel.updateOne({
                [USER_NAME]: req.currentUser[USER_NAME]
            }, {
                [APPLICATION_NAMES]: JSON.stringify(applicationNames)
            });
        }
        else {
            return sendSingleError(res, APPLICATION_NAME_ALREADY_EXIST);
        }

        return res.status(okayStatus).send(lowerCaseApplicationName);

    }
        
}

export async function getApplicationName(req: Request, res: Response) {
    if(req.currentUser && req.currentUser[APPLICATION_NAMES] && typeof req.currentUser[APPLICATION_NAMES]) {
        const applicationNames = JSON.parse(req.currentUser[APPLICATION_NAMES]);
        return res.status(okayStatus).send({[APPLICATION_NAMES]: applicationNames});
    }
}
import {APPLICATION_NAMES, okayStatus, USER_NAME} from '@ranjodhbirkaur/common';
import {Request, Response} from 'express';
import {ClientUserModel} from "../authMongoConnection";

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName} = req.body;

    if(req.currentUser && req.currentUser[APPLICATION_NAMES] && typeof req.currentUser[APPLICATION_NAMES]) {
        const applicationNames = JSON.parse(req.currentUser[APPLICATION_NAMES]);
        applicationNames.push(applicationName);

        const updated = await ClientUserModel.updateOne({
            [USER_NAME]: req.currentUser[USER_NAME]
        }, {
            [APPLICATION_NAMES]: JSON.stringify(applicationNames)
        });

        console.log('updated', updated)

        return res.status(okayStatus).send(true);

    }
        
}
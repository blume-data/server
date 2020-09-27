import { APPLICATION_NAMES, ClientUser, okayStatus } from '@ranjodhbirkaur/common';
import {Request, Response} from 'express';

export async function createApplicationName(req: Request, res: Response) {
    const {applicationName} = req.body;

    if(req.currentUser && req.currentUser[APPLICATION_NAMES] && typeof req.currentUser[APPLICATION_NAMES]) {
        const applicationNames = JSON.parse(req.currentUser[APPLICATION_NAMES]);
        applicationNames.push(applicationName);

        await ClientUser.findOneAndUpdate({
            userName: req.currentUser.userName
        }, {
            [APPLICATION_NAMES]: JSON.stringify(applicationNames)
        });

        return res.status(okayStatus).send(true);

    }
        
}
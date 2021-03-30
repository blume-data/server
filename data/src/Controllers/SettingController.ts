import {Request, Response} from 'express';
import {
    APPLICATION_NAME,
    CLIENT_USER_NAME,
    okayStatus,
    sendSingleError,
} from "@ranjodhbirkaur/common";
import { CollectionModel } from '../models/Collection';

export async function getSetting(req: Request, res: Response) {


    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    const modelName = req.params['modelName'];

    const settings = await CollectionModel.findOne(
        {clientUserName, name: modelName, applicationName},
        ['name', 'setting']
        ).populate('setting');

    if(settings && settings.setting) {
        res.status(okayStatus).send(settings.setting);
    }
    else {
        sendSingleError(res, 'setting was not found for this model');
    }
}
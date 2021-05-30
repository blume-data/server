import {Request, Response} from 'express';
import {
    APPLICATION_NAME,
    CLIENT_USER_NAME,
    ID,
    okayStatus,
    sendSingleError,
} from "../../../util/common-module";
import { CollectionModel } from '../../../db-models/Collection';
import { SettingModel } from '../../../db-models/ModelSetting';
import { sendOkayResponse } from '../../../util/methods';

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

export async function makeSetting(req: Request, res: Response) {

    const {restrictedUserGroups=[], permittedUserGroups=[], isPublic=false} = req.body;

    const newSettings = SettingModel.build({
        permittedUserGroups: (permittedUserGroups && Array.isArray(permittedUserGroups) ? permittedUserGroups : []),
        restrictedUserGroups: (restrictedUserGroups && Array.isArray(restrictedUserGroups) ? restrictedUserGroups : []),
        isPublic: false,
        updatedBy: `${req.currentUser[ID]}`,
        supportedDomains: []
    });
    try {
        await newSettings.save();
    } catch (error) {
        return sendSingleError(res, `permittedUserGroups is not okay`, 'permittedUserGroups');
    }

    return sendOkayResponse(res);
    
}
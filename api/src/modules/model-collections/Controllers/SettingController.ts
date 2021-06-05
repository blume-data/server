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
import { v4 } from 'uuid';

export async function getSetting(req: Request, res: Response) {


    const language = req.params.language;
    const clientUserName = req.params[CLIENT_USER_NAME];
    const applicationName = req.params[APPLICATION_NAME];
    const modelName = req.params['modelName'];

    const settings = await CollectionModel.findOne(
        {clientUserName, name: modelName, applicationName},
        ['name', 'setting']
        ).populate('setting');

    if(settings && settings.settingId) {
        res.status(okayStatus).send(settings.settingId);
    }
    else {
        sendSingleError(res, 'setting was not found for this model');
    }
}

export async function makeSetting(req: Request, res: Response) {

    const {restrictedUserGroups=[], permittedUserGroups=[], isPublic=false, supportedDomains} = req.body;

    const uid = v4();
    
    const newSettings = SettingModel.build({
        permittedUserGroupIds: (permittedUserGroups && Array.isArray(permittedUserGroups) ? permittedUserGroups : []),
        restrictedUserGroupIds: (restrictedUserGroups && Array.isArray(restrictedUserGroups) ? restrictedUserGroups : []),
        isPublic: false,
        id: uid,
        updatedById: `${req.currentUser.id}`,
        supportedDomains
    });
    try {
        await newSettings.save();
    } catch (error) {
        console.log('error', error)
        return sendSingleError(res, `permittedUserGroups is not okay`, 'permittedUserGroups');
    }

    return sendOkayResponse(res);
    
}
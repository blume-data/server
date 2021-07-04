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
import { getNowDate, sendOkayResponse } from '../../../util/methods';
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

    const {restrictedUserGroups=[], permittedUserGroups=[], isPublic=false, isEnabled=false, supportedDomains=[], id} = req.body;

    if(req.method === 'POST') {

        const uid = v4();
    
        const newSettings = SettingModel.build({
            permittedUserGroupIds: (permittedUserGroups && Array.isArray(permittedUserGroups) ? permittedUserGroups : []),
            restrictedUserGroupIds: (restrictedUserGroups && Array.isArray(restrictedUserGroups) ? restrictedUserGroups : []),
            isPublic,
            id: uid,
            isEnabled,
            updatedById: `${req.currentUser.id}`,
            supportedDomains,
            updatedAt: getNowDate()
        });
        try {
            const newSetting = await newSettings.save();
            return sendOkayResponse(res, {id: newSetting.id});
        } catch (error) {
            console.log('error while creating setting', error)
            return sendSingleError(res, `permittedUserGroups is not okay`, 'permittedUserGroups');
        } 
    }   
    else {
        let body: any = {};

        if(permittedUserGroups) {
            body.permittedUserGroupIds = permittedUserGroups;
        }

        if(restrictedUserGroups) {
            body.restrictedUserGroupIds = restrictedUserGroups;
        }
        if(typeof isPublic === 'boolean') {
            body.isPublic = isPublic;
        }
        if(supportedDomains) {
            body.supportedDomains = supportedDomains;
        }

        body = {
            ...body,
            updatedAt: getNowDate(),
            updatedById: `${req.currentUser.id}`
        }

        await SettingModel.findOneAndUpdate({id}, body);
        console.log('Updated settings', body, id);
        sendOkayResponse(res, {id});
    }
}
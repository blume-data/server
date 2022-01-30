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
        sendSingleError({
            res, 
            message: 'setting was not found for this model'
        });
    }
}

export async function makeSetting(req: Request, res: Response) {

    const {
        getRestrictedUserGroups=[], postRestrictedUserGroups=[], putRestrictedUserGroups=[], deleteRestrictedUserGroups=[],
        getPermittedUserGroups=[], postPermittedUserGroups=[], deletePermittedUserGroups=[], putPermittedUserGroups=[],
        isPublic=false, isEnabled=false, supportedDomains="", id} = req.body;

    const sd = JSON.stringify(supportedDomains);

    if(req.method === 'POST') {

        const uid = v4();
    
        const newSettings = SettingModel.build({

            getPermittedUserGroupIds: (getPermittedUserGroups && Array.isArray(getPermittedUserGroups) ? getPermittedUserGroups : []),
            postPermittedUserGroupIds: (postPermittedUserGroups && Array.isArray(postPermittedUserGroups) ? postPermittedUserGroups : []),
            deletePermittedUserGroupIds: (deletePermittedUserGroups && Array.isArray(deletePermittedUserGroups) ? deletePermittedUserGroups : []),
            putPermittedUserGroupIds: (putPermittedUserGroups && Array.isArray(putPermittedUserGroups) ? putPermittedUserGroups : []),

            getRestrictedUserGroupIds: (getRestrictedUserGroups && Array.isArray(getRestrictedUserGroups) ? getRestrictedUserGroups : []),
            postRestrictedUserGroupIds: (postRestrictedUserGroups && Array.isArray(postRestrictedUserGroups) ? postRestrictedUserGroups : []),
            deleteRestrictedUserGroupIds: (deleteRestrictedUserGroups && Array.isArray(deleteRestrictedUserGroups) ? deleteRestrictedUserGroups : []),
            putRestrictedUserGroupIds: (putRestrictedUserGroups && Array.isArray(putRestrictedUserGroups) ? putRestrictedUserGroups : []),

            isPublic,
            id: uid,
            isEnabled,
            updatedById: `${req.currentUser.id}`,
            supportedDomains: sd,
            updatedAt: getNowDate()
        });
        try {
            const newSetting = await newSettings.save();
            return sendOkayResponse(res, {id: newSetting.id});
        } catch (error) {
            console.log('error while creating setting', error)
            return sendSingleError({
                res, 
                message: `permittedUserGroups is not okay`, 
                field: 'permittedUserGroups'
            });
        } 
    }   
    else {
        let body: any = {};

        if(getPermittedUserGroups) {
            body.getPermittedUserGroupIds = getPermittedUserGroups;
        }
        if(postPermittedUserGroups) {
            body.postPermittedUserGroupIds = postPermittedUserGroups;
        }
        if(putPermittedUserGroups) {
            body.putPermittedUserGroupIds = putPermittedUserGroups;
        }
        if(deletePermittedUserGroups) {
            body.deletePermittedUserGroupIds = deletePermittedUserGroups;
        }

        if(getRestrictedUserGroups) {
            body.getRestrictedUserGroupIds = getRestrictedUserGroups;
        }
        if(postRestrictedUserGroups) {
            body.postRestrictedUserGroupIds = postRestrictedUserGroups;
        }
        if(putRestrictedUserGroups) {
            body.putRestrictedUserGroupIds = putRestrictedUserGroups;
        }
        if(deleteRestrictedUserGroups) {
            body.deleteRestrictedUserGroupIds = deleteRestrictedUserGroups;
        }

        if(typeof isPublic === 'boolean') {
            body.isPublic = isPublic;
        }
        if(supportedDomains) {
            body.supportedDomains = sd;
        }

        body = {
            ...body,
            updatedAt: getNowDate(),
            updatedById: `${req.currentUser.id}`
        }

        await SettingModel.findOneAndUpdate({id}, body);
        // console.log('Updated settings', body, id);
        sendOkayResponse(res, {id});
    }
}
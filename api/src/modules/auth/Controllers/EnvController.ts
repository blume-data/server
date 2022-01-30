import { ID, trimCharactersAndNumbers } from '@ranjodhbirkaur/constants';
import { Request, Response } from 'express';
import { ApplicationSpaceModel } from '../../../db-models/ApplicationSpace';
import { EnvModel } from '../../../db-models/Env';
import { sendSingleError } from '../../../util/common-module';
import { sendOkayResponse } from '../../../util/methods';
import {v4} from 'uuid';

export async function CreateEnv(req: Request, res: Response) {

    const clientUserName = req.params.clientUserName;
    const applicationName = req.params.applicationName;
    const name = req.body.name;
    const description = req.body.description || '';
    const id = req.body.id;


    const exist = await EnvModel.findOne({name: trimCharactersAndNumbers(name), clientUserName, applicationName}, ['_id', 'name']);
    if(exist && name !== exist.name) {
        return sendSingleError({
            res, 
            message: 'Env with same name already exist', 
            field: 'name'
        });
    }
    else {
        if(id) {
            // update env
            await EnvModel.findOneAndUpdate({
                id
            }, { description });
        }
        else {
            const ApplicationNameEntry: any = await ApplicationSpaceModel.findOne({
                clientUserName,
                name: applicationName
            }, ['env']).populate('env');
            
            if(ApplicationNameEntry && ApplicationNameEntry.env) {
            // create an env
            const newEnv = EnvModel.build({
                name: trimCharactersAndNumbers(name),
                description,
                clientUserName, 
                id: v4(),
                applicationName,
                order: ApplicationNameEntry.env.length + 1,
                isPublic: true,
                supportedDomains: ['*'],
                createdById: req.currentUser.id,
                updatedById: req.currentUser.id,
            });
    
            await newEnv.save();
            
            await ApplicationSpaceModel.findOneAndUpdate({
                clientUserName,
                name: applicationName
            }, {
                $push: { envId: newEnv.id }
            });
    
            }
        }
        sendOkayResponse(res, {status: 'done'});
    }
}
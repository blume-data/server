import { ID, trimCharactersAndNumbers } from '@ranjodhbirkaur/constants';
import { Request, Response } from 'express';
import { ApplicationSpaceModel } from '../../../db-models/ApplicationSpace';
import { EnvModel } from '../../../db-models/Env';
import { sendSingleError } from '../../../util/common-module';
import { sendOkayResponse } from '../../../util/methods';

export async function CreateEnv(req: Request, res: Response) {

    const clientUserName = req.params.clientUserName;
    const applicationName = req.params.applicationName;
    const name = req.body.name;
    const description = req.body.description || '';
    const id = req.body._id;


    const exist = await EnvModel.findOne({name: trimCharactersAndNumbers(name), clientUserName, applicationName}, '_id');
    if(exist) {
        console.log('exist', exist)
        return sendSingleError(res, 'Env with same name already exist', 'name');
    }
    else {
        if(id) {
            // update env
            await EnvModel.findOneAndUpdate({
                _id: id
            }, {name: trimCharactersAndNumbers(name),description});
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
                applicationName,
                order: ApplicationNameEntry.env.length + 1,
                isPublic: true,
                supportedDomains: ['*'],
                createdBy: req.currentUser[ID],
                updatedBy: req.currentUser[ID],
            });
    
            await newEnv.save();
            
            await ApplicationSpaceModel.findOneAndUpdate({
                clientUserName,
                name: applicationName
            }, {
                $push: { env: newEnv._id }
            });
    
            }
        }
        sendOkayResponse(res, {status: 'done'});
    }

    
}
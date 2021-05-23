import { trimCharactersAndNumbers } from '@ranjodhbirkaur/constants';
import { Request, Response } from 'express';
import { ApplicationSpaceModel } from '../../../db-models/ApplicationSpace';
import { sendSingleError } from '../../../util/common-module';
import { sendOkayResponse } from '../../../util/methods';

export async function CreateEnv(req: Request, res: Response) {
    console.log('any', req.currentUser);

    const clientUserName = req.params.clientUserName;
    const applicationName = req.params.applicationName;
    const name = req.body.name;
    const description = req.body.description || '';

    const ApplicationNameEntry = await ApplicationSpaceModel.findOne({
        clientUserName,
        name: applicationName
    }, ['env']);

    

    if(ApplicationNameEntry && ApplicationNameEntry.env && Array.isArray(ApplicationNameEntry.env)) {
        
        const exist = ApplicationNameEntry.env.find(item => item.name === trimCharactersAndNumbers(name));
        if(exist) {
            return sendSingleError(res, 'Env already exist', 'name');
        }
        else {
            ApplicationNameEntry.env.push({
                name: trimCharactersAndNumbers(name), description, order: ApplicationNameEntry.env.length + 1
            });
            // update the applicationSpace
            await ApplicationSpaceModel.findOneAndUpdate({
                clientUserName, name: applicationName
            }, {
                env: ApplicationNameEntry.env
            });
        }

    }
    sendOkayResponse(res, {status: 'done'});
}
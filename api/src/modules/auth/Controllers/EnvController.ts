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

    const ApplicationNameEntry: any = await ApplicationSpaceModel.findOne({
        clientUserName,
        name: applicationName
    }, ['env']).populate('env');

    

    if(ApplicationNameEntry && ApplicationNameEntry.env && Array.isArray(ApplicationNameEntry.env)) {
        
        const exist = ApplicationNameEntry.env.find((item: any) => item.name === trimCharactersAndNumbers(name));
        if(exist) {
            return sendSingleError(res, 'Env already exist', 'name');
        }
        else {
            // create a new env
            const newEnv = EnvModel.build({
                name: trimCharactersAndNumbers(name),
                description,
                order: ApplicationNameEntry.env.length + 1,
                isPublic: true,
                supportedDomains: [''],
                createdBy: req.currentUser[ID],
                updatedBy: req.currentUser[ID],
            });
            await newEnv.save();
            ApplicationNameEntry.env.push(newEnv[ID]);
            
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
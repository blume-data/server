import { Request, Response } from 'express';
import { ApplicationSpaceModel } from '../../../db-models/ApplicationSpace';
import { sendOkayResponse } from '../../../util/methods';

export async function CreateEnv(req: Request, res: Response) {
    console.log('any', req.currentUser);

    const clientUserName = req.params.clientUserName;
    const applicationName = req.params.applicationName;

    const ApplicationNameEntry = await ApplicationSpaceModel.findOneAndUpdate({
        clientUserId: req.currentUser.id,
        
    })

    sendOkayResponse(res, {status: true});
   
}
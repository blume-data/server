import {NextFunction, Request, Response} from "express";
import {APPLICATION_NAME, ID, sendSingleError} from "../util/common-module";
import {ApplicationSpaceModel} from "../db-models/ApplicationSpace";

export const validateApplicationNameMiddleWare = async (req: Request, res: Response, next: NextFunction) => {

    const applicationName  = req.params && req.params[APPLICATION_NAME];
    const clientUserName = req.params.clientUserName;
    const env = req.params.env;
     
    const applicationNames: any = await ApplicationSpaceModel.findOne({
        clientUserName,
        name: applicationName
    }, ['name', 'envId']).populate('env', 'name');

    if(env && applicationNames) {
        const exist = applicationNames.env.find((item: any) => item.name === env);
        if(!exist) {
            return sendSingleError({
                res, 
                message: 'env is not valid'
            });
        }
    }

    if (applicationNames) {
        next();
    }
    else {
        return sendSingleError({
            res, 
            message: `Application name is not valid`
        });
    }
};
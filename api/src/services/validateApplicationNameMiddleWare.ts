import {NextFunction, Request, Response} from "express";
import {APPLICATION_NAME, ID, sendSingleError} from "../util/common-module";
import {ApplicationSpaceModel} from "../db-models/ApplicationSpace";

export const validateApplicationNameMiddleWare = async (req: Request, res: Response, next: NextFunction) => {

    const applicationName  = req.params && req.params[APPLICATION_NAME];

    const applicationNames = await ApplicationSpaceModel.find({
        clientUserId: req.currentUser[ID]
    }, ['name'])

    const exist = applicationNames.find((item) => {
        return item.name === applicationName
    });

    if (exist) {
        next();
    }
    else {
        return sendSingleError(res, `Application name is not valid`);
    }
};
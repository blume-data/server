import {NextFunction, Request, Response} from "express";
import {APPLICATION_NAME, ApplicationNameType, sendSingleError} from "@ranjodhbirkaur/common";

export const validateApplicationNameMiddleWare = (req: Request, res: Response, next: NextFunction) => {

    const applicationName  = req.params && req.params[APPLICATION_NAME];
    const applicationNames: ApplicationNameType[] = req.currentUser.applicationNames;

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
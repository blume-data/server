import {NextFunction, Request, Response} from "express";
import {APPLICATION_NAME, sendSingleError} from "@ranjodhbirkaur/common";

export const validateApplicationNameMiddleWare = (req: Request, res: Response, next: NextFunction) => {

    const applicationName  = req.params && req.params[APPLICATION_NAME];
    const applicationNames = req.currentUser.applicationNames;
    if (applicationNames.includes(applicationName)) {
        next();
    }
    else {
        return sendSingleError(res, `Application name is not valid`);
    }
};
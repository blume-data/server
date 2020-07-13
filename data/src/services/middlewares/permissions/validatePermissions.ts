import {Request, Response, NextFunction} from "express";
import {ErrorMessages} from "../../../util/interface";
import {errorStatus} from "../../../util/constants";
import {BadRequestError} from "@ranjodhbirkaur/common";

export async function validatePermission(req: Request, res: Response, next: NextFunction) {

    const modelProps = req.body;
    // if permissions only contain * it can access all collections
    // if permissions contains * with strings. It can access all collections except those collectionName
    // if permissions only contain collection name. It can only access those collections
    if (modelProps.permissions && typeof modelProps.permissions === 'object' && modelProps.permissions.length) {
        if (modelProps.permissions.length === 1 && modelProps.permissions[0] === '*') {
            //All permissions are granted to this role
            next();
        }
        else {
            let isValid = true;
            let errorMessages: ErrorMessages[] = [];

            for (const permission of modelProps.permissions) {
                if (typeof permission === 'string' && permission !== '*') {
                    // check if the name of the collection exist
                }
                else if(permission !== '*') {
                    isValid = true;
                    errorMessages.push({
                        message: 'permission should be an array of collection names'
                    });
                }
            }
            if (!isValid) {
                res.status(errorStatus).send(errorMessages);
            }
            else {
                next();
            }
        }
    }
    else {
        throw new BadRequestError('Permissions should be an array of collection names');
    }
}
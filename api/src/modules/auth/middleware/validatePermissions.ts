import {NextFunction, Request, Response} from "express";
import {errorStatus} from "../../../util/common-module";
import {PERMISSION_IS_NOT_PRESENT, PERMISSION_IS_NOT_VALID} from "../util/errorMessages";

export function validateRolePermissions(req: Request, res: Response, next: NextFunction) {

    const permissions = req.body;
    let isValid = true;
    if (permissions) {
        permissions.forEach((permission: any) => {
            if (typeof permission !== "string") {
                isValid = false;
            }
        });
        if (isValid) next();
        else {
            return res.status(errorStatus).send({
                errors: [{
                    message: PERMISSION_IS_NOT_VALID,
                    field: 'permissions'
                }]
            })
        }
    }
    else {
        return res.status(errorStatus).send({
            errors: [{
                message: PERMISSION_IS_NOT_PRESENT,
                field: 'permissions'
            }]
        })
    }

}
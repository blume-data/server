import {NextFunction, Router, Request, Response} from 'express';
import {roleUrl} from "../util/urls";
import {body} from "express-validator";
import {
    clientUserType,
    NotAuthorizedError,
    sendSingleError,
    stringLimitOptionErrorMessage,
    stringLimitOptions
} from "@ranjodhbirkaur/common";
import {createRole, updateRole} from "../Controllers/RoleController";
import {validateRolePermissions} from "../middleware/validatePermissions";
import {AUTHORIZATION_TOKEN} from "../../../data/src/util/constants";
import jwt from 'jsonwebtoken';
import {ClientUser} from "../models/clientUser";

const router = Router();

function RoleValidations() {
    return [
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name')),
        body('language')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('language')),
        body('clientUserName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('clientUserName')),
        body('applicationName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('applicationName')),
        body('env')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('env'))
    ]
}

async function checkUserType(req: Request, res: Response, next: NextFunction) {

    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    const userName  = req.params && req.params.userName;
    try {
        const headers: any = req.headers;

        let payload: any;

        if (headers[AUTHORIZATION_TOKEN]) {
            // verify token
            payload = jwt.verify(
                headers[AUTHORIZATION_TOKEN],
                process.env.JWT_KEY!
            );
        }
        else if(req.session && req.session.jwt) {
            payload = jwt.verify(
                req.session.jwt,
                process.env.JWT_KEY!
            )
        }
        // check the payload
        if (payload && payload.userName && payload.userName === userName) {

            const user = await ClientUser.findOne({
                userName,
            }, 'jwtId');

            if (user && user.jwtId && user.jwtId === payload.jwtId) {
                next();
            }
            else {
                throw new Error();
            }
        }
        else {
            throw new Error();
        }
    }
    catch (e) {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        throw new NotAuthorizedError();
    }
}

router.post(roleUrl(), checkUserType, RoleValidations(), validateRolePermissions, createRole);

router.put(roleUrl(), checkUserType, RoleValidations(), validateRolePermissions, updateRole);
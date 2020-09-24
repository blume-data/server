import {Request, Response, NextFunction} from "express";
import {
    BadRequestError, supportUserType, superVisorUserType, sendSingleError,
    freeUserType, SupportedUserType,
    ErrorMessages, adminUserType, adminType, clientUserType, CLIENT_USER_NAME, APPLICATION_NAME, ENV,
    FIRST_NAME, LAST_NAME, EMAIL, pushErrors, sendErrors, USER_NAME, PASSWORD, APPLICATION_NAMES
} from "@ranjodhbirkaur/common";
import {ADMIN_USER_TYPE_NOT_VALID, APPLICATION_NAME_NOT_VALID, CLIENT_USER_NAME_NOT_VALID} from "../util/errorMessages";
import {FreeUser} from "../models/freeUser";
import {ClientUser} from "../models/clientUser";

export async function validateUserType(req: Request, res: Response, next: NextFunction) {

    const userType = req.params && req.params.userType;
    const reqBody = req.body;
    let errorMessages: ErrorMessages[] = [];
    let isValid = true;

    if (userType) {
        if (SupportedUserType.includes(userType)) {

            if(!reqBody.userName) {
                isValid=false;
                pushErrors(errorMessages, 'userName is required', USER_NAME);
            }
            if (!reqBody.password) {
                isValid=false;
                pushErrors(errorMessages, 'password is required', PASSWORD);
            }
            if (!isValid) {
                return sendErrors(res, errorMessages);
            }
            else {
                next();
            }
        }
        else {
            throw new BadRequestError(`userType: ${userType} is not supported`);
        }
    }
    else {
        throw new BadRequestError('userType is not valid');
    }
}
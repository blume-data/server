import {Request, Response, NextFunction} from "express";
import {
    BadRequestError, supportUserType, superVisorUserType, sendSingleError,
    freeUserType, SupportedUserType, clientType, SUPPORTED_CLIENT_USER_TYPE,
    errorStatus, ErrorMessages, adminUserType, adminType, clientUserType
} from "@ranjodhbirkaur/common";
import {ADMIN_USER_TYPE_NOT_VALID, CLIENT_USER_TYPE_NOT_VALID} from "../util/errorMessages";

export async function validateUserType(req: Request, res: Response, next: NextFunction) {

    const userType = req.params && req.params.userType;
    const reqBody = req.body;

    if (userType) {
        if (SupportedUserType.includes(userType)) {
            let isValid = true;
            let errorMessages: ErrorMessages[] = [];
            switch (userType) {
                case clientUserType: {
                    if (reqBody[clientType]) {
                        reqBody[clientType] = supportUserType;
                    }
                    if(!reqBody[clientType]
                        || typeof reqBody[clientType] !== 'string'
                        || !SUPPORTED_CLIENT_USER_TYPE.includes(reqBody[clientType])) {
                        return sendSingleError(res, CLIENT_USER_TYPE_NOT_VALID, clientType);
                    }
                    break;
                }
                case freeUserType: {
                    if (!reqBody.email && !reqBody.userName) {
                        isValid = false;
                        errorMessages.push({
                            message: 'email or username is required'
                        });
                    }
                    if (!reqBody.password) {
                        isValid = false;
                        errorMessages.push({
                            message: 'password is required',
                            field: 'password'
                        });
                    }
                    if (!isValid) {
                        return res.status(errorStatus).send({
                            errors: errorMessages
                        });
                    }
                    else {
                        reqBody.firstName= 'taranjeet';
                        reqBody.lastName = 'singh';
                        if(reqBody.email && !reqBody.userName) {
                            reqBody.userName = 'taranjeetsingh';
                        }
                        else if(reqBody.userName && !reqBody.email) {
                            reqBody.email = 'taranjeetplay@gmail.com';
                        }
                    }
                    break;
                }
                case adminUserType: {
                    if(!reqBody[adminType]
                        || typeof reqBody[adminType] !== 'string'
                        || ![adminUserType, supportUserType, superVisorUserType].includes(reqBody[adminType])) {

                        return sendSingleError(res, ADMIN_USER_TYPE_NOT_VALID, adminType);
                    }
                }
            }
            next();
        }
        else {
            throw new BadRequestError(`User type: ${userType} is not supported`);
        }
    }
    else {
        throw new BadRequestError('User type is not valid');
    }
}
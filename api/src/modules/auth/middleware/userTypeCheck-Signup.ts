import { clientUserType, ENV, freeUserType, superVisorUserType, SupportedUserType, supportUserType, USER_NAME } from "@ranjodhbirkaur/constants";
import {Request, Response, NextFunction} from "express";
import {
    BadRequestError, sendSingleError,
    ErrorMessages, CLIENT_USER_NAME, APPLICATION_NAME,
    FIRST_NAME, LAST_NAME, EMAIL, pushErrors, sendErrors, PASSWORD, verifyJwt, JwtPayloadType,
} from "../../../util/common-module";
import {ADMIN_USER_TYPE_NOT_VALID} from "../util/errorMessages";


export async function validateUserTypeSignUp(req: Request, res: Response, next: NextFunction) {

    const userType = req.body && req.body.userType;
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

            switch (userType) {
                case clientUserType: {
                    // user who own the whole application
                    if (!reqBody[FIRST_NAME]) {
                        isValid=false;
                        pushErrors(errorMessages, `${FIRST_NAME} is required`, FIRST_NAME);
                    }
                    if (!reqBody[LAST_NAME]) {
                        isValid=false;
                        pushErrors(errorMessages, `${LAST_NAME} is required`, LAST_NAME);
                    }
                    if (!reqBody[EMAIL]) {
                        isValid=false;
                        pushErrors(errorMessages, `${EMAIL} is required`, EMAIL);
                    }
                    break;
                }

                case superVisorUserType: {

                    // requires authentication of client user
                    // only clientUserType (main) has permissio to create a supervisoruserType
                    const payload: JwtPayloadType = verifyJwt(req);
                    if(!payload) {
                        isValid = false;
                        return sendSingleError(res, 'Not authorised');
                    }
                    else if(payload && payload.clientType !== clientUserType) {
                        isValid = false;
                        return sendSingleError(res, `only ${clientUserType} has permission to create a ${SupportedUserType} type of user`);
                    }
                    break;
                }

                case supportUserType: {

                    // requires authentication of client user or a supervisor user
                    // only clientUserType/Supervisor has permission to create a support user type
                    const payload: JwtPayloadType = verifyJwt(req);
                    if(!payload) {
                        isValid = false;
                        return sendSingleError(res, 'Not authorised');
                    }
                    else if(payload && !(payload.clientType === clientUserType || payload.clientType === superVisorUserType)) {
                        isValid = false;
                        return sendSingleError(res, `only ${clientUserType}/${superVisorUserType} have permission to create a ${SupportedUserType} type of user`);
                    }

                    if (!reqBody[APPLICATION_NAME]) {
                        isValid=false;
                        pushErrors(errorMessages, `${APPLICATION_NAME} is required`, APPLICATION_NAME);
                    }
                    break;
                }

                case freeUserType: {
                    // can be created without authentication
                    if (!reqBody[CLIENT_USER_NAME]) {
                        isValid=false;
                        pushErrors(errorMessages, `${CLIENT_USER_NAME} is required`, CLIENT_USER_NAME);
                    }
                    if (!reqBody[APPLICATION_NAME] && userType !== superVisorUserType) {
                        isValid=false;
                        pushErrors(errorMessages, `${APPLICATION_NAME} is required`, APPLICATION_NAME);
                    }
                    if (!reqBody[ENV] && userType !== superVisorUserType && userType !== supportUserType) {
                        isValid=false;
                        pushErrors(errorMessages, `${ENV} is required`, ENV);
                    }
                    break;
                }
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
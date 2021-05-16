import {Request, Response, NextFunction} from "express";
import {
    BadRequestError, supportUserType, superVisorUserType, sendSingleError,
    freeUserType, SupportedUserType,
    ErrorMessages, adminUserType, adminType, clientUserType, CLIENT_USER_NAME, APPLICATION_NAME, ENV,
    FIRST_NAME, LAST_NAME, EMAIL, pushErrors, sendErrors, USER_NAME, PASSWORD,
} from "../../../util/common-module";
import {ADMIN_USER_TYPE_NOT_VALID} from "../util/errorMessages";


export async function validateUserTypeSignUp(req: Request, res: Response, next: NextFunction) {

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
                // TODO
                // Take a look at admin type sign-up
                case adminUserType: {
                    if(!reqBody[adminType]
                        || typeof reqBody[adminType] !== 'string'
                        || ![adminUserType, supportUserType, superVisorUserType].includes(reqBody[adminType])) {

                        return sendSingleError(res, ADMIN_USER_TYPE_NOT_VALID, adminType);
                    }
                    break;
                }
                default: {
                    // requires user to be authenticated
                    if ((userType === freeUserType || userType === supportUserType || userType === superVisorUserType)) {
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
                    }
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
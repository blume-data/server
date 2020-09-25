import {Request, Response, NextFunction} from "express";
import {
    BadRequestError,
    SupportedUserType,
    ErrorMessages,
    pushErrors, sendErrors, USER_NAME, PASSWORD
} from "@ranjodhbirkaur/common";


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
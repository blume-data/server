import {Request, Response, NextFunction} from "express";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {ErrorMessages} from "../util/ínterface";
import {errorStatus} from "../util/constants";

export const adminUserType = 'admin';
export const clientUserType = 'client';// client user
export const freeUserType = 'user';// free user
export const SupportedUserType = [adminUserType, clientUserType, freeUserType];

export async function validateUserType(req: Request, res: Response, next: NextFunction) {

    const userType = req.params && req.params.userType;
    const reqBody = req.body;

    if (userType) {
        if (SupportedUserType.includes(userType)) {
            let isValid = true;
            let errorMessages: ErrorMessages[] = [];
            if (userType === freeUserType) {
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
            }
            next();
        }
        else {
            throw new BadRequestError(`User type: ${userType} is not supported`);
        }
    }
    else {
        throw new BadRequestError('User type is not supported!');
    }
}
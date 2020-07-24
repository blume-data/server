import {Request, Response, NextFunction} from "express";
import {BadRequestError} from "@ranjodhbirkaur/common";

const adminUser = 'admin';
const clientUser = 'client';// client user
const freeUser = 'user';// free user
export const SupportedUserType = [adminUser, clientUser, freeUser];

export async function validateUserType(req: Request, res: Response, next: NextFunction) {

    const userType = req.params && req.params.userType;

    if (userType) {
        if (SupportedUserType.includes(userType)) {
            //All permissions are granted to this role
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
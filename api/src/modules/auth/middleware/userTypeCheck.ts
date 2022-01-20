import { SupportedUserType } from "@ranjodhbirkaur/constants";
import {Request, Response, NextFunction} from "express";
import {sendSingleError
} from "../../../util/common-module";


export async function validateUserType(req: Request, res: Response, next: NextFunction) {

    const userType = req.params && req.params.userType;

    if (!SupportedUserType.includes(userType)) {
        return sendSingleError(res, `userType: ${userType} is not supported`);
    }
    else {
        next();
    }
}
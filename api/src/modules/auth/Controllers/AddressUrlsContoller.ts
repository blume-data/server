import {Response, Request} from 'express';
import {okayStatus} from "../../../util/common-module";

import {
    authRootUrl, register, logOut, logIn, currentUser, emailVerification, userNameValidation
} from "../util/urls";
export function getAddressUrl(req: Request, res: Response) {

    const userType = req.params && req.params.userType;
    return res.status(okayStatus).send({
        auth: {
            authRootUrl,
            register,
            logOut,
            logIn,
            currentUser,
            emailVerification,
            userNameValidation
        }
    });
}
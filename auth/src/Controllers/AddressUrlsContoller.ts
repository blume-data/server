import {Response, Request} from 'express';
import {okayStatus} from "@ranjodhbirkaur/common";
import {authRootUrl, logOut, register, logIn, currentUser, emailVerification, userNameValidation} from "../util/urls";
export function getAddressUrl(req: Request, res: Response) {
    return res.status(okayStatus).send({
        authRootUrl, register, logOut,
        logIn, currentUser, emailVerification,
        userNameValidation
    });
}
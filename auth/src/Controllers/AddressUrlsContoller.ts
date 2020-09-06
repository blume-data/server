import {Response, Request} from 'express';
import {okayStatus} from "@ranjodhbirkaur/common";
import {
    authRootUrl,
    signUpUrl, signOutUrl, currentUserUrl, emailVerificationUrl, userNameValidationUrl, signInUrl
} from "../util/urls";
export function getAddressUrl(req: Request, res: Response) {

    const userType = req.params && req.params.userType;
    return res.status(okayStatus).send({
        auth: {
            authRootUrl,
            register: signUpUrl(userType),
            logOut: signOutUrl(userType),
            logIn: signInUrl(userType),
            currentUser: currentUserUrl(userType),
            emailVerification: emailVerificationUrl(userType),
            userNameValidation: userNameValidationUrl(userType)
        }
    });
}
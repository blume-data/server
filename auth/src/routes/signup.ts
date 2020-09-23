import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    okayStatus,
    RANDOM_STRING,
    errorStatus,
    adminUserType,
    clientUserType,
    freeUserType,
    clientType,
    stringLimitOptionErrorMessage,
    stringLimitOptions,
    generateJwt,
    sendJwtResponse,
    sendSingleError,
    superVisorUserType,
    CLIENT_USER_NAME,
    supportUserType,
    EMAIL,
    USER_NAME
} from '@ranjodhbirkaur/common';
import {
    passwordLimitOptionErrorMessage,
    passwordLimitOptions,

} from "../util/constants";
import {ClientTempUser} from "../models/clientTempUser";
import {ClientUser} from "../models/clientUser";
import {validateUserType} from "../middleware/userTypeCheck";
import {EmailInUseMessage, InValidEmailMessage, UserNameNotAvailableMessage} from "../util/errorMessages";
import {AdminUser} from "../models/adminUser";
import {signUpUrl} from "../util/urls";
import {FreeUser} from "../models/freeUser";
import {ClientUserJwtPayloadType} from "@ranjodhbirkaur/common/build/interface";

const
    router = express.Router();

router.post(
    signUpUrl(), validateUserType,
    [
        body('email')
            .optional()
            .isEmail().withMessage(InValidEmailMessage),
        body('password')
            .trim()
            .isLength(passwordLimitOptions)
            .withMessage(passwordLimitOptionErrorMessage('password')),
        body('firstName')
            .optional()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('first name')),
        body('lastName')
            .optional()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('last name')),
        body('userName')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('userName')),
    ],
    validateRequest,

  async (req: Request, res: Response) => {

        const userType = req.params.userType;

        switch (userType) {
            case clientUserType: {
                return await saveUser(req, res);
            }
            case freeUserType: {

                break;
            }
            case adminUserType: {
                // needs to be looked again
                return await saveUser(req, res, adminUserType);
            }
        }
  }
);

export { router as signupRouter };

/*
* Register client user
* */
async function saveUser(req: Request, res: Response, type=clientUserType ) {

    const { email, password, firstName, lastName, userName, clientUserName, applicationName, env } = req.body;
    const [adminType] = req.body;

    let existingUser;
    // Check if the email is not taken
    switch (type) {
        case clientUserType: {
            existingUser = await ClientUser.findOne({email});
            break;
        }
        case adminUserType: {
            existingUser = await AdminUser.findOne({email});
            break;
        }
        default: {
            if (type === freeUserType || type === superVisorUserType || type === supportUserType) {
                if (email) {
                    existingUser = await FreeUser.find({email});
                }
            }
        }
    }
    if (existingUser) {
        return sendSingleError(res, EmailInUseMessage, EMAIL);
    }

    // check if the user name is not taken for client User
    existingUser = null;
    switch (type) {
        case clientUserType: {
            existingUser = await ClientUser.findOne({userName});
            break;
        }
        case adminUserType: {
            existingUser = await AdminUser.findOne({userName});
            break;
        }
        default: {
            if (type === freeUserType || type === superVisorUserType || type === supportUserType) {
                existingUser = await FreeUser.find({userName});
            }
        }
    }
    if (existingUser) {
        return sendSingleError(res, UserNameNotAvailableMessage, USER_NAME);
    }

    const verificationToken = RANDOM_STRING(4);

    let user, payload;
    const jwtId = RANDOM_STRING(10);

    switch (type) {
        case adminUserType: {
            const created_at = `${new Date()}`;
            user = AdminUser.build({ email, password, userName, adminType, jwtId, created_at });
            await user.save();
            payload = {
                id: user.id,
                email: user.email,
                userName: user.userName
            };
            const userJwt = generateJwt(payload, req);
            return sendJwtResponse(res, payload, userJwt, user);
        }
        case clientUserType: {

            user = ClientTempUser.build({ email, password, firstName, lastName, userName, verificationToken, clientType: clientUserType });
            await user.save();

            payload = {
                id: user.id,
                email: user.email,
                userName: user.userName,
                // TODO remove verification token later
                verificationToken: user.verificationToken
            };
            break;
        }
        case freeUserType: {
            user = ClientTempUser.build({ email, password, firstName, lastName, userName, verificationToken, clientType: freeUserType });
            await user.save();
            payload = {
                userName: user.userName,
                verificationToken: user.verificationToken
            };
            break;
        }
        case superVisorUserType: {
            user = FreeUser.build({ email, password, userName, clientType: superVisorUserType, jwtId, clientUserName });
            await user.save();
            const jwt: ClientUserJwtPayloadType = {
                clientUserName,
                jwtId,
                applicationName,
                userName
            };
            const userJwt = generateJwt(jwt, req);
            return sendJwtResponse(res, {userName, clientUserName}, userJwt, user);
        }
        case supportUserType: {
            user = FreeUser.build({ email, password, userName, clientType: supportUserType, jwtId, clientUserName, applicationName });
            await user.save();
            const jwt: ClientUserJwtPayloadType = {
                clientUserName,
                jwtId,
                applicationName,
                userName
            };
            const userJwt = generateJwt(jwt, req);
            return sendJwtResponse(res, {userName, clientUserName}, userJwt, user);
        }
    }

    res.status(okayStatus).send({... payload});
}

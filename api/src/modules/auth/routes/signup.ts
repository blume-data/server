import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    okayStatus,
    RANDOM_STRING,
    adminUserType,
    clientUserType,
    freeUserType,
    stringLimitOptionErrorMessage,
    stringLimitOptions,
    sendSingleError,
    superVisorUserType,
    supportUserType,
    EMAIL,
    USER_NAME,
    ErrorMessages,
    APPLICATION_NAMES,
    CLIENT_USER_NAME,
    pushErrors,
    sendErrors,
} from '../../../util/common-module';
import {
    passwordLimitOptionErrorMessage,
    passwordLimitOptions,
} from "../util/constants";
import {ClientTempUser} from "../../../db-models/clientTempUser";

import {validateUserTypeSignUp} from "../middleware/userTypeCheck-Signup";
import {CLIENT_USER_NAME_NOT_VALID, EmailInUseMessage, InValidEmailMessage, UserNameNotAvailableMessage} from "../util/errorMessages";
import {signUpUrl} from "../util/urls";
import {trimCharactersAndNumbers} from "@ranjodhbirkaur/constants";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";

const
    router = express.Router();

router.post(
    signUpUrl(), validateUserTypeSignUp,
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
        req.body.userName = trimCharactersAndNumbers(req.body.userName);

        switch (userType) {
            case clientUserType: {
                return await saveUser(req, res);
            }
            case freeUserType: {
                return await saveUser(req, res, freeUserType);
            }
            case supportUserType: {
                return await saveUser(req, res, supportUserType);
            }
            case superVisorUserType: {
                return await saveUser(req, res, superVisorUserType);
            }
            case adminUserType: {
                // needs to be looked again
                return await saveUser(req, res, adminUserType);
            }
        }
  }
);

export { router as signupRouter };


async function validateClientUserName(req: Request): Promise<{isValid: boolean; errorMessages: ErrorMessages[]}> {

    let isValid = true;
    const reqBody = req.body;
    const userType = req.params.userType;
    let errorMessages: ErrorMessages[] = [];
    
    const userExist = await MainUserModel.findOne({
        userName: reqBody[CLIENT_USER_NAME]
    }, [USER_NAME, APPLICATION_NAMES]);
    
    if (!userExist) {
        isValid=false;
        pushErrors(errorMessages, CLIENT_USER_NAME_NOT_VALID, CLIENT_USER_NAME);
    }
    else {
        if (!userExist[USER_NAME] || userExist[USER_NAME] !== reqBody[CLIENT_USER_NAME]) {
            isValid=false;
            pushErrors(errorMessages, CLIENT_USER_NAME_NOT_VALID, CLIENT_USER_NAME);
        }

    }
    return {
        isValid,
        errorMessages
    };
}

/*
* Register client user
* */
async function saveUser(req: Request, res: Response, type=clientUserType ) {

    const { email, password, firstName, lastName, userName, clientUserName, applicationName } = req.body;
    const [adminType] = req.body;

    if(type !== clientUserType && type !== adminUserType) {
        const resp = await validateClientUserName(req);
        if(!resp.isValid) {
            return sendErrors(res, resp.errorMessages);
        }
    }
    
    let existingUser;
    // Check if the email is not taken
    switch (type) {
        case clientUserType: {
            existingUser = await MainUserModel.findOne({email});
            break;
        }
        case adminUserType: {
            //existingUser = await AdminUser.findOne({email});
            break;
        }
        default: {
            if (type === freeUserType || type === superVisorUserType || type === supportUserType) {
                if (email) {
                    //existingUser = await FreeUser.findOne({email});
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
            existingUser = await MainUserModel.findOne({userName});
            break;
        }
        case adminUserType: {
            //existingUser = await AdminUser.findOne({userName});
            break;
        }
        default: {
            if (type === freeUserType || type === superVisorUserType || type === supportUserType) {
                //existingUser = await FreeUser.findOne({userName});
            }
        }
    }
    if (existingUser) {
        return sendSingleError(res, UserNameNotAvailableMessage, USER_NAME);
    }

    const verificationToken = RANDOM_STRING(4);

    let user;

    switch (type) {
        case clientUserType: {

            user = ClientTempUser.build({
                email, password, firstName, lastName,  userName, verificationToken, clientType: clientUserType
            });
            await user.save();

            console.log('verification token', user.verificationToken);
            break;
        }
    }

    res.status(okayStatus).send(true);
}

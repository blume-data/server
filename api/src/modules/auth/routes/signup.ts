import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    okayStatus,
    RANDOM_STRING,
    stringLimitOptionErrorMessage,
    stringLimitOptions,
    sendSingleError,
    EMAIL,
    ErrorMessages,
    APPLICATION_NAMES,
    CLIENT_USER_NAME,
    pushErrors,
    sendErrors,
    JwtPayloadType,
    verifyJwt,
} from '../../../util/common-module';
import {
    passwordLimitOptionErrorMessage,
    passwordLimitOptions,
} from "../util/constants";
import {ClientTempUser} from "../../../db-models/clientTempUser";

import {validateUserTypeSignUp} from "../middleware/userTypeCheck-Signup";
import {CLIENT_USER_NAME_NOT_VALID, EmailInUseMessage, InValidEmailMessage, UserNameNotAvailableMessage} from "../util/errorMessages";
import {signUpUrl} from "../util/urls";
import {clientUserType, freeUserType, superVisorUserType, supportUserType, trimCharactersAndNumbers, USER_NAME} from "@ranjodhbirkaur/constants";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationSpaceModel } from '../../../db-models/ApplicationSpace';

const router = express.Router();

router.post(
    signUpUrl,
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
        body('userType')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('userType')),
    ],
    validateRequest, validateUserTypeSignUp,

  async (req: Request, res: Response) => {

        const userType = req.body.userType;
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
        }
  }
);

async function validateClientUserName(req: Request): Promise<{isValid: boolean; errorMessages: ErrorMessages[]}> {

    let isValid = true;
    const reqBody = req.body;
    const userType = req.body.userType;
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

/* Register client user */
async function saveUser(req: Request, res: Response, type=clientUserType ) {

    const { email, password, firstName, lastName, userName, clientUserName, applicationName } = req.body;
    
    // validate the client user name
    if(type !== clientUserType) {
        const resp = await validateClientUserName(req);
        if(!resp.isValid) {
            return sendErrors(res, resp.errorMessages);
        }
    }
    let existingUser;
    
    // Check unique email address
    if(email) {
        existingUser = await MainUserModel.findOne({email});
        if (existingUser) {
            return sendSingleError(res, EmailInUseMessage, EMAIL);
        }
    }

    // check is userName is not taken
    if(userName) {
        existingUser = await MainUserModel.findOne({userName});
        if(existingUser) {
            return sendSingleError(res, UserNameNotAvailableMessage, USER_NAME);
        }
    }

    const verificationToken = RANDOM_STRING(4);

    switch (type) {
        case clientUserType: {

            const user = ClientTempUser.build({
                email, password, firstName, lastName,  userName, verificationToken, clientType: clientUserType
            });
            await user.save();

            console.log('verification token', user.verificationToken);
            break;
        }

        case freeUserType: {

            // check if application names exist
            if(!req.body[APPLICATION_NAMES] || (req.body[APPLICATION_NAMES] && !req.body[APPLICATION_NAMES].length)) {
                return sendSingleError(res, `${APPLICATION_NAMES} should be array of valid applicationName ids`, APPLICATION_NAMES);
            }
            else {
                const exist: any = await ApplicationSpaceModel.findOne({id: req.body[APPLICATION_NAMES][0]}, '_id env').populate('env', 'id');
                if(!exist) {
                    return sendSingleError(res, `${APPLICATION_NAMES} are not valid`, APPLICATION_NAMES)
                }
                else {
                    // check if all envs are valid
                    // check if envs exist
                    if(!req.body.envs || (req.body.envs && !req.body.envs.length)) {
                        return sendSingleError(res, `envs should be array of valid env ids`, 'envs');
                    }
                    else {
                        let isValid = true;
                        req.body.envs.forEach((env: string) => {
                            const found = exist.envs.find((item: any) => item.id === env);
                            if(!found) isValid = false;
                        });
                        if(!isValid) {
                            return sendSingleError(res, 'envs are not valid ids', 'envs');
                        }
                    }

                }

            }

            const payload: JwtPayloadType = verifyJwt(req);
            const user = ClientTempUser.build({
                email, 
                password, 
                firstName, 
                lastName,  
                userName, 
                verificationToken, 
                clientType: freeUserType,
                clientUserName: payload.userName,
                applicationNames: req.body[APPLICATION_NAMES],
                envs: req.body.envs
            });

        }

        default : {
            // TODO add application names
            const user = MainUserModel.build({
                email, 
                password, 
                firstName, 
                lastName,  
                userName, 
                type, 
                id: uuidv4(),
                jwtId: RANDOM_STRING(10)
            });
            await user.save();
            break;
        }
    }

    res.status(okayStatus).send(true);
}

export { router as signupRouter };
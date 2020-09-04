import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest, okayStatus, RANDOM_STRING,
    errorStatus, adminUserType, clientUserType,
    freeUserType, supportUserType,
    stringLimitOptionErrorMessage,
    stringLimitOptions,
    generateJwt, sendJwtResponse
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

const
    router = express.Router();

router.post(
    signUpUrl, validateUserType,
    [
        body('email').isEmail().withMessage(InValidEmailMessage),
        body('password')
            .trim()
            .isLength(passwordLimitOptions)
            .withMessage(passwordLimitOptionErrorMessage('password')),
        body('firstName')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('first name')),
        body('lastName')
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

    const { email, password, firstName, lastName, userName } = req.body;
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
    }
    if (existingUser) {
        return res.status(errorStatus).send({
            errors: [{
                message: EmailInUseMessage,
                field: 'email'
            }]
        });
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
        }
    }
    if (existingUser) {
        return res.status(errorStatus).send({
            errors: [{
                message: UserNameNotAvailableMessage,
                field: 'userName'
            }]
        });
    }

    const verificationToken = RANDOM_STRING(4);

    let user, payload;

    switch (type) {
        case adminUserType: {
            user = AdminUser.build({ email, password, userName, adminType });
            await user.save();
            payload = {
                id: user.id,
                email: user.email,
                userName: user.userName
            };
            break;
        }
        default : {
            user = ClientTempUser.build({ email, password, firstName, lastName, userName, verificationToken });
            await user.save();
            payload = {
                id: user.id,
                email: user.email,
                userName: user.userName,
                // TODO remove verification token later
                verificationToken: user.verificationToken
            };
            const userJwt = generateJwt(payload, req);
            return sendJwtResponse(res, payload, userJwt, user);
        }
    }

    res.status(okayStatus).send({... payload});
}

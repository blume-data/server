import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest, BadRequestError, okayStatus, RANDOM_STRING, errorStatus} from '@ranjodhbirkaur/common';
import {
    passwordLimitOptionErrorMessage,
    passwordLimitOptions,
    stringLimitOptionErrorMessage,
    stringLimitOptions
} from "../util/constants";
import {ClientTempUser} from "../models/clientTempUser";
import {signUpUrl} from "../util/urls";
import {ClientUser} from "../models/clientUser";
import {adminUserType, clientUserType, freeUserType, validateUserType} from "../middleware/userTypeCheck";
import {EmailInUseMessage, InValidEmailMessage, UserNameNotAvailableMessage} from "../util/errorMessages";

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
                return await saveClientUser(req, res);
            }
            case freeUserType: {
                break;
            }
            case adminUserType: {
                break;
            }
        }
  }
);

export { router as signupRouter };

/*
* Register client user
* */
async function saveClientUser(req: Request, res: Response) {

    const { email, password, firstName, lastName, userName } = req.body;

    // Check if the email is not taken
    let existingUser = await ClientUser.findOne({ email });

    if (existingUser) {
        return res.status(errorStatus).send({
            errors: [{
                message: EmailInUseMessage,
                field: 'email'
            }]
        });
    }
    // check if the user name is not taken
    existingUser = await ClientUser.findOne({ userName });
    if (existingUser) {
        return res.status(errorStatus).send({
            errors: [{
                message: UserNameNotAvailableMessage,
                field: 'username'
            }]
        });
    }

    const verificationToken = RANDOM_STRING(4);

    const user = ClientTempUser.build({ email, password, firstName, lastName, userName, verificationToken });
    await user.save();

    const payload = {
        id: user.id,
        email: user.email,
        userName: user.userName,
        // TODO remove verification token later
        verificationToken: user.verificationToken
    };

    res.status(okayStatus).send({... payload});
}

import express from 'express';
import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, query} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {isUserNameAvailable, verifyEmailToken} from "../Controllers/UserController";
import {emailVerificationUrl, userNameValidationUrl} from "../util/urls";
import {InValidEmailMessage, TOKEN_IS_REQUIRED_MESSAGE} from "../util/errorMessages";

const router = express.Router();

router.post(userNameValidationUrl, [
        body('userName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username'))
    ],
    validateRequest, isUserNameAvailable);

router.get(emailVerificationUrl, [
    query('token')
        .trim()
        .notEmpty()
        .withMessage(TOKEN_IS_REQUIRED_MESSAGE)
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('token')),
    query('email').isEmail().withMessage(InValidEmailMessage)
    ],
    validateRequest, verifyEmailToken);

export { router as routes };
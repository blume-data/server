import express from 'express';
import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, query} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {isUserNameAvailable, verifyEmailToken} from "../Controllers/UserController";
import {emailVerificationUrl, userNameValidationUrl} from "../util/urls";

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
        .withMessage('token is required')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('token')),
    query('email').isEmail().withMessage('Email must be valid')
    ],
    validateRequest, verifyEmailToken);

export { router as routes };
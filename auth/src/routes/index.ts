import express from 'express';
import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, query} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {isUserNameAvailable, verifyEmailToken} from "../Controllers/UserController";

const router = express.Router();

router.post(rootUrl+'client/username-validation', [
        body('userName')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username'))
    ],
    validateRequest, isUserNameAvailable);

router.get(rootUrl+'client/email-verification', [
    query('token')
        .trim()
        .notEmpty()
        .withMessage('token is required')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('token'))
    ],
    validateRequest, verifyEmailToken);

export { router as routes };
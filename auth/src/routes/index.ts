import express from 'express';
import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, query} from "express-validator";
import {validateEnvType, validateRequest} from "@ranjodhbirkaur/common";
import {isUserNameAvailable, verifyEmailToken} from "../Controllers/UserController";
import {emailVerificationUrl, userNameValidationUrl} from "../util/urls";

const router = express.Router();

router.post(userNameValidationUrl, [
        body('userName')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username'))
    ], validateEnvType,
    validateRequest, isUserNameAvailable);

router.get(emailVerificationUrl, [
    query('token')
        .trim()
        .notEmpty()
        .withMessage('token is required')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('token')),
    query('email').isEmail().withMessage('Email must be valid')
    ], validateEnvType,
    validateRequest, verifyEmailToken);

export { router as routes };
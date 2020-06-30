import express from 'express';
import {stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, param, query} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {emailVerificationUrl, userNameValidationUrl} from "../util/urls";
import {createItemSchema} from "../Controllers/ItemSchemaController";

const router = express.Router();

router.post(userNameValidationUrl, [
        param('userName')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username')),
        body('rules')
            .trim()
            .notEmpty()
            .withMessage('rules is required'),
        body('name')
            .trim()
            .notEmpty()
            .withMessage('name is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name'))
    ],
    validateRequest, createItemSchema);

/*router.get(emailVerificationUrl, [
    query('token')
        .trim()
        .notEmpty()
        .withMessage('token is required')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('token')),
    query('email').isEmail().withMessage('Email must be valid')
    ],
    validateRequest, verifyEmailToken);*/

export { router as routes };
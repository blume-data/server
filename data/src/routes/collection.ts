import express from 'express';
import {stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body, param} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {emailVerificationUrl, CollectionUrl, userNameValidationUrl} from "../util/urls";
import {createItemSchema} from "../Controllers/CollectionController";

const router = express.Router();

// Create Item Schema
router.post(CollectionUrl, [
        body('rules')
            .trim()
            .notEmpty()
            .withMessage('rules is required'),
        body('name')
            .trim()
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

export { router as CollectionRoutes };
import express from 'express';
import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {isUserNameAvailable} from "../Controllers/UserController";

const router = express.Router();

router.post(rootUrl+'client/validate/username', [
        body('userName')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username'))
    ],
    validateRequest, isUserNameAvailable);

export { router as routes };
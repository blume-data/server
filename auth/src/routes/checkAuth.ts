import express from "express";
import {clusterCheckUser } from "../util/urls";
import {body, query} from "express-validator";
import {stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {validateRequest} from "@ranjodhbirkaur/common";
import {isUserEnabled} from "../Controllers/AuthController";

const router = express.Router();

router.post(clusterCheckUser, [
        body('userName')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('username'))
    ],
    validateRequest, isUserEnabled);

export { router as checkAuthRoutes };
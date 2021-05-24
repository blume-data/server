import { ENV } from "@ranjodhbirkaur/constants";
import { Router } from "express";
import { body } from "express-validator";
import { checkAuth } from "../../../services/checkAuth";
import { stringLimitOptionErrorMessage, stringLimitOptions, validateRequest } from "../../../util/common-module";
import { CreateEnv } from "../Controllers/EnvController";
import { EnvUrl } from "../util/urls";

const router = Router();

router.post(EnvUrl, checkAuth,

    [body('name')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV)),

    body('description')
    .optional()
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV))],

    validateRequest,

    CreateEnv
    );

router.put(EnvUrl, checkAuth,

    [
    body('name')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV)),

    body('description')
    .optional()
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV)),

    body('_id')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV))
    ],
    
    validateRequest,
    
    CreateEnv
    );

export {router as EnvRouter};
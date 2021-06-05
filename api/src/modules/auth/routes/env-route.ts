import { ENV } from "@ranjodhbirkaur/constants";
import { Router } from "express";
import { body } from "express-validator";
import { checkAuth } from "../../../services/checkAuth";
import { validateApplicationNameMiddleWare } from "../../../services/validateApplicationNameMiddleWare";
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
    validateApplicationNameMiddleWare,
    CreateEnv
    );

router.put(EnvUrl, checkAuth,

    [
    body('description')
    .optional()
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV)),

    body('id')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV))
    ],
    
    validateRequest,
    validateApplicationNameMiddleWare,
    
    CreateEnv
    );

export {router as EnvRouter};
import { ENV } from "@ranjodhbirkaur/constants";
import { Router } from "express";
import { express } from "express-useragent";
import { body } from "express-validator";
import { checkAuth } from "../../../services/checkAuth";
import { APPLICATION_NAME, stringLimitOptionErrorMessage, stringLimitOptions } from "../../../util/common-module";
import { CreateEnv } from "../Controllers/EnvController";
import { EnvUrl } from "../util/urls";

const router = Router();

router.post(EnvUrl, checkAuth,

    body('name')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(ENV)),

    CreateEnv
    )

export {router as EnvRouter};
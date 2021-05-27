import { ENV, PASSWORD } from "@ranjodhbirkaur/constants";
import {Router} from "express";
import { body } from "express-validator";
import { checkAuth } from "../../../services/checkAuth";
import { stringLimitOptionErrorMessage, stringLimitOptions, USER_NAME, validateRequest } from "../../../util/common-module";
import { CreateUpdateOtherUser } from "../Controllers/OtherUserController";
import {CreateOtherUsers} from "../util/urls";

const router = Router();

router.post(CreateOtherUsers,
    [body('userName')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(USER_NAME)),

    body('password')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage(PASSWORD)),

    body('type')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage('type')),
],

     validateRequest,
     checkAuth, CreateUpdateOtherUser);

export {router as createOtherUsersRouter};
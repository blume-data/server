import { ENV, PASSWORD, USER_NAME } from "@ranjodhbirkaur/constants";
import {Router} from "express";
import { body } from "express-validator";
import { checkAuth } from "../../../services/checkAuth";
import { validateApplicationNameMiddleWare } from "../../../services/validateApplicationNameMiddleWare";
import { stringLimitOptionErrorMessage, stringLimitOptions, validateRequest } from "../../../util/common-module";
import { CreateUpdateOtherUser, CreateUserGroup, FetchUserGroup } from "../Controllers/OtherUserController";
import {CreateOtherUsersUrl, CreateUserGroupUrl} from "../util/urls";

const router = Router();

router.post(CreateOtherUsersUrl,
    [
    body('userName')
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

    body('userGroup')
    .trim()
    .isLength(stringLimitOptions)
    .withMessage(stringLimitOptionErrorMessage('userGroup')),
],

     validateRequest,
     checkAuth, 
     validateApplicationNameMiddleWare,
     CreateUpdateOtherUser);

router.post(CreateUserGroupUrl,
    [
        body('name')
        .trim()
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('name')),

        body('description')
        .optional()
        .trim()
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('description'))
    ],
    validateRequest,
    checkAuth, 
    validateApplicationNameMiddleWare,
    CreateUserGroup);

router.get(CreateUserGroupUrl, FetchUserGroup);

export {router as createOtherUsersRouter};
import express from "express";
import {RoleUrl} from "../util/urls";
import {checkAuth} from "../services/checkAuth";
import {validatePermission} from "../services/middlewares/permissions/validatePermissions";
import {CreateRole, GetRoles} from "../Controllers/RoleController";
import {body} from "express-validator";
import {stringLimitOptionErrorMessage, stringLimitOptions, validateRequest,

    } from "@ranjodhbirkaur/common";
import {validateLanguage} from "../util/laguage";

const router = express.Router();

router.post(RoleUrl, checkAuth, validatePermission,
    [
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name')),
        body('language')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('language')),
    ],
    validateRequest, validateLanguage,
    CreateRole);

// get role
router.get(RoleUrl, checkAuth, GetRoles);

export { router as RoleRoutes };

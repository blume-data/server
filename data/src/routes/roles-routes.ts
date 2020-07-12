import express from "express";
import {RoleUrl} from "../util/urls";
import {checkAuth} from "../services/checkAuth";
import {validatePermission} from "../services/middlewares/validatePermissions";
import {CreateRole, GetRoles} from "../Controllers/RoleController";
import {body} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {validateLanguage} from "../util/laguage";

const router = express.Router();

router.post(RoleUrl, checkAuth, validatePermission,
    [
        body('name').trim().notEmpty().withMessage('name is required'),
        body('language').trim().notEmpty().withMessage('language is required'),
    ],
    validateRequest, validateLanguage,
    CreateRole);

// get role
router.get(RoleUrl, checkAuth, GetRoles);

export { router as RoleRoutes };

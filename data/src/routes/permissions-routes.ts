import express from "express";
import {PermissionUrl, RoleUrl} from "../util/urls";
import {checkAuth} from "../services/checkAuth";
import {body} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {CreatePermission, GetPermissions} from "../Controllers/PermissionController";
import {validatePermissionType} from "../util/permissionTypes";

const router = express.Router();

router.post(PermissionUrl, checkAuth,
    [
        body('name').trim().notEmpty().withMessage('name is required'),
        body('type').trim().notEmpty().withMessage('type is required'),
    ],
    validateRequest, validatePermissionType,
    CreatePermission);

// get role
router.get(PermissionUrl, checkAuth, GetPermissions);

export { router as PermissionRoutes };

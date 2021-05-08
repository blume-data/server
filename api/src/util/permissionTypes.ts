import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "./common-module";

export const GET_PERMISSION = 'GET';
export const UPDATE_PERMISSION = 'UPDATE';
export const POST_PERMISSION = 'POST';
export const DELETE_PERMISSION = 'DELETE';

export const SUPPORTED_PERMISSIONS = [GET_PERMISSION, UPDATE_PERMISSION, POST_PERMISSION, DELETE_PERMISSION];

export function validatePermissionType(req: Request, res: Response, next: NextFunction ) {
    const permissionType = req.body && req.body.type;
    const exist = SUPPORTED_PERMISSIONS.find((item: string) => item === permissionType);
    if (exist) {
        next();
    }
    else {
        throw new BadRequestError('Permission type is not supported');
    }
}
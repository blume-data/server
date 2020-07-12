import {Response, Request} from 'express';
import {okayStatus} from "../util/constants";
import {PermissionsModel} from "../models/permissions";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {PERMISSION_NAME_EXIST} from "./Messages";

export async function CreatePermission(req: Request, res: Response) {

    const userName = req.params && req.params.userName;

    const exist = await PermissionsModel.findOne({
        name: req.body.name,
        userName,
        type: req.body.type,
    }, 'id');

    if(exist) {
        throw new BadRequestError(PERMISSION_NAME_EXIST);
    }

    const newPermission = PermissionsModel.build({
        name: req.body.name,
        userName,
        type: req.body.type,
    });

    await newPermission.save();

    res.status(okayStatus).send(newPermission);

}

export async function GetPermissions(req: Request, res: Response) {

    const userName = req.params && req.params.userName;
    const name = req.params && req.params.permissionName;

    const conditions: {
        userName: string;
        name?: string;
    }  = {
        userName
    };
    if (name) {
        conditions['name'] = name;
    }

    const permissions = await PermissionsModel.find(conditions);

    res.status(okayStatus).send(permissions);

}
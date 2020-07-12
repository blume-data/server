import {Response, Request} from 'express';
import {okayStatus} from "../util/constants";
import {RolesModel} from "../models/roles";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {ROLE_NAME_EXIST} from "./Messages";

export async function CreateRole(req: Request, res: Response) {

    const userName = req.params && req.params.userName;
    const {language, name, permissions=['*']} = req.body;

    const exist = await RolesModel.findOne({
        userName, name
    }, 'id');

    if(exist) {
        throw new BadRequestError(ROLE_NAME_EXIST);
    }

    const newRole = RolesModel.build({
        userName,
        language,
        permissions,
        name
    });

    await newRole.save();

    res.status(okayStatus).send(newRole);

}
import {Response, Request, NextFunction} from 'express';
import {RolesModel} from "../models/roles";
import {errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {ROLE_ALREADY_EXIST} from "../util/errorMessages";

export const createRole = async (req: Request, res: Response) => {

    const {clientUserName, name, language, applicationName, env, permissions} = req.body;

    const exist = await RolesModel.findOne({
        clientUserName, name, applicationName, language, env
    });

    if(exist) {
        return res.status(errorStatus).send({
            message: ROLE_ALREADY_EXIST,
            field: 'role'
        })
    }

    const newRole = RolesModel.build({
        clientUserName, name, applicationName, language, env, permissions: JSON.stringify(permissions)
    });
    await newRole.save();
    res.status(okayStatus).send(true);
};

export const updateRole = async (req: Request, res: Response) => {

    const {clientUserName, name, applicationName, env, permissions, language} = req.body;

    await RolesModel.findOneAndUpdate({clientUserName, name, applicationName, env, language}, {permissions});

    res.status(okayStatus).send(true);

};
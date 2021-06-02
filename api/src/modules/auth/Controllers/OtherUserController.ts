import { clientUserType, DESCRIPTION, ID, PASSWORD, SupportedUserType, trimCharactersAndNumbers, USER_NAME } from "@ranjodhbirkaur/constants";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import { UserGroupModel } from "../../../db-models/UserGroup";
import { UserModel } from "../../../db-models/UserModel";
import { RANDOM_STRING, sendSingleError } from "../../../util/common-module";
import { sendOkayResponse } from "../../../util/methods";
import { v4 as uuidv4 } from 'uuid';

export async function CreateUpdateOtherUser(req: Request, res: Response) {

    const {type, userName, password, details, email, userGroups=[], _id} = req.body;
    const {clientUserName, applicationName, env} = req.params;

    // check userType
    if(type && (!SupportedUserType.includes(type) || type === clientUserType)) {
        return sendSingleError(res, 'type is not valid', 'type');
    }

    if(_id) {
        // update the user
        await UserModel.findByIdAndUpdate(_id, {
            type, password, details, email, userGroupIds: userGroups
        });

        return sendOkayResponse(res);
    }

    // check if user is not used already
    const exist = await UserModel.findOne({userName}, '_id');
    if(exist) {
        return sendSingleError(res, 'userName is not available', 'userName');
    }

    const newUser = UserModel.build({
        userName,
        password,
        type,
        details,
        env,
        clientUserName, applicationName,
        email,
        userGroupIds: userGroups,
        isEnabled: true,
        jwtId: RANDOM_STRING(10)
    });

    await newUser.save();

    sendOkayResponse(res);
}

export async function CreateUserGroup(req: Request, res: Response) {

    const {name, description, _id} = req.body;
    const {applicationName, clientUserName, env} = req.params;

    if(_id) {
        // update the userGroup
        await UserGroupModel.findByIdAndUpdate(_id, {
            name, description
        });
        return sendOkayResponse(res);
    }

    const date = DateTime.local().setZone('UTC').toJSDate();

    // check if already exist
    const exist = await UserGroupModel.findOne({
        name: trimCharactersAndNumbers(name), clientUserName, applicationName, env
    }, [ID]);

    if(exist) {
        return sendSingleError(res, 'user group with same name already exist', 'name');
    }

    const id = uuidv4();
    const newUserGroup = UserGroupModel.build({
        env,
        name: trimCharactersAndNumbers(name), 
        description,
        clientUserName,
        applicationName,
        createdAt: date,
        updatedAt: date,
        id,
        createdBy: req.currentUser[ID],
        updatedBy: req.currentUser[ID]
    });

    await newUserGroup.save();

    return sendOkayResponse(res);
    
}

export async function FetchUserGroup(req: Request, res: Response) {

    const {applicationName, clientUserName, env} = req.params;

    const userGroups = await UserGroupModel.find({
        clientUserName, applicationName, env
    }, ['name', DESCRIPTION, 'id']);

    return sendOkayResponse(res,userGroups);
    
}

export async function FetchUsers(req: Request, res: Response) {
    const {applicationName, clientUserName, env} = req.params;


    const users = await UserModel.find(
        {
            clientUserName, applicationName, env
        }, 
        ['name', USER_NAME, 'type', PASSWORD, 'userGroupIds']
    )
    .populate('userGroups');

    return sendOkayResponse(res, users);
    
}
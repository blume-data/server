import { clientUserType, DESCRIPTION, ID, SupportedUserType, trimCharactersAndNumbers, USER_NAME } from "@ranjodhbirkaur/constants";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import { UserGroupModel } from "../../../db-models/UserGroup";
import { UserModel } from "../../../db-models/UserModel";
import { RANDOM_STRING, sendSingleError } from "../../../util/common-module";
import { sendOkayResponse } from "../../../util/methods";

export async function CreateUpdateOtherUser(req: Request, res: Response) {

    const {type, userName, password, details, email, userGroup} = req.body;
    const {clientUserName, applicationName, env} = req.params;

    // check userType
    if(type && (!SupportedUserType.includes(type) || type === clientUserType)) {
        return sendSingleError(res, 'type is not valid', 'type');
    }
    // check if user is not used already
    const exist = await UserModel.findOne({userName}, '_id');
    if(exist) {
        return sendSingleError(res, 'userName is not available', 'userName');
    }

    // check if the userGroup exist
    const userGroupExist = await UserGroupModel.findById(userGroup, '_id');
    if(!userGroupExist) {
        return sendSingleError(res, 'userGroup does not exist', 'userGroup');
    }

    const newUser = UserModel.build({
        userName,
        password,
        type,
        details,
        env,
        clientUserName, applicationName,
        email,
        userGroup,
        isEnabled: true,
        jwtId: RANDOM_STRING(10)
    });

    await newUser.save();

    sendOkayResponse(res);
}

export async function CreateUserGroup(req: Request, res: Response) {

    const {name, description} = req.body;
    const {applicationName, clientUserName, env} = req.params;

    const date = DateTime.local().setZone('UTC').toJSDate();

    // check if already exist
    const exist = await UserGroupModel.findOne({
        name: trimCharactersAndNumbers(name), clientUserName, applicationName, env
    }, [ID]);

    if(exist) {
        return sendSingleError(res, 'user group with same name already exist', 'name');
    }

    const newUserGroup = UserGroupModel.build({
        env,
        name: trimCharactersAndNumbers(name), 
        description,
        clientUserName,
        applicationName,
        createdAt: date,
        updatedAt: date,
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
    }, ['name', DESCRIPTION]);

    return sendOkayResponse(res,userGroups);
    
}

export async function FetchUsers(req: Request, res: Response) {
    const {applicationName, clientUserName, env} = req.params;

    const users = await UserModel.find({
        clientUserName, applicationName, env
    }, ['name', USER_NAME, 'type', 'userGroup']);

    return sendOkayResponse(res, users);
    
}
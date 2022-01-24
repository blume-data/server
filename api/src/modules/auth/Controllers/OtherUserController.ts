import { clientUserType, DESCRIPTION, ID, PASSWORD, SupportedUserType, trimCharactersAndNumbers, USER_NAME } from "@ranjodhbirkaur/constants";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import { UserGroupModel } from "../../../db-models/UserGroup";
import { UserModel } from "../../../db-models/UserModel";
import { RANDOM_STRING, sendSingleError, validateEmail } from "../../../util/common-module";
import { flatObject, sendOkayResponse } from "../../../util/methods";
import { v4 as uuidv4 } from 'uuid';

export async function CreateUpdateOtherUser(req: Request, res: Response) {

    const {type, userName, password, details, email, userGroups=[], id} = req.body;
    const {clientUserName, applicationName, env} = req.params;

    // check if email/user is valid
    if(!userName && !email) {
        return sendSingleError(res, "One of email or userName is required");
    }

    // validate email
    if(email && !validateEmail(email)) {
        return sendSingleError(res, "email must be a valid email address", 'email');
    }

    // check userType
    if(type && (!SupportedUserType.includes(type) || type === clientUserType)) {
        return sendSingleError(res, 'type is not valid', 'type');
    }

    if(id) {
        // update the user
        try {
            await UserModel.findOneAndUpdate({id, clientUserName, applicationName, env}, {
                type, password, details, email, userGroupIds: userGroups
            });
        } catch (error) {
            return sendSingleError(res, 'userGroups ids are not valid', 'userGroups')
            
        }

        return sendOkayResponse(res);
    }

    // check userName if user is not used already
    if(userName) { 
        const exist = await UserModel.findOne({userName}, '_id');
        if(exist) {
            return sendSingleError(res, 'userName is not available', 'userName');
        }
    }

    // check email if user is not used already
    if(email) {
        const exist = await UserModel.findOne({email}, '_id');
        if(exist) {
            return sendSingleError(res, 'email is not available', 'email');
        }
    }

    const newUser = UserModel.build({
        userName,
        password,
        type,
        details,
        env,
        id: uuidv4(),
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

    const {name, description, id} = req.body;
    const {applicationName, clientUserName, env} = req.params;

    if(id) {
        // update the userGroup
        await UserGroupModel.findOneAndUpdate({id, clientUserName, applicationName, env}, {
            name: trimCharactersAndNumbers(name), description
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

    const uid = uuidv4();
    const newUserGroup = UserGroupModel.build({
        env,
        name: trimCharactersAndNumbers(name), 
        description,
        clientUserName,
        applicationName,
        createdAt: date,
        updatedAt: date,
        id: uid,
        createdById: req.currentUser.id,
        updatedById: req.currentUser.id
    });

    await newUserGroup.save();

    return sendOkayResponse(res);
    
}

export async function FetchUserGroup(req: Request, res: Response) {

    const {applicationName, clientUserName, env} = req.params;

    const userGroups = await UserGroupModel.find({
        clientUserName, applicationName, env
    }, ['name', DESCRIPTION, 'id']);

    return sendOkayResponse(res, flatObject(userGroups));
    
}

export async function FetchUsers(req: Request, res: Response) {
    const {applicationName, clientUserName, env} = req.params;

    const users = await UserModel.find({clientUserName, applicationName, env}, 
        ['name', USER_NAME, 'type', PASSWORD, 'userGroupIds']
    )
    .populate('userGroups', 'name description');

    const flatUsers = flatObject(users, {
        userGroupIds: undefined
    }, [{name: 'userGroups'}]);

    return sendOkayResponse(res, flatUsers);    
}
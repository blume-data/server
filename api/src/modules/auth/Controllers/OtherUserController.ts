import { clientUserType, SupportedUserType } from "@ranjodhbirkaur/constants";
import { Request, Response } from "express";
import { UserModel } from "../../../db-models/UserModel";
import { RANDOM_STRING, sendSingleError } from "../../../util/common-module";
import { sendOkayResponse } from "../../../util/methods";

export async function CreateUpdateOtherUser(req: Request, res: Response) {

    const {type, userName, password, details, email} = req.body;

    // check userType
    if(type && (!SupportedUserType.includes(type) || type === clientUserType)) {
        return sendSingleError(res, 'type is not valid', 'type');
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
        email,
        isEnabled: true,
        jwtId: RANDOM_STRING(10)
    });

    await newUser.save();

    sendOkayResponse(res, {okay: newUser});
}
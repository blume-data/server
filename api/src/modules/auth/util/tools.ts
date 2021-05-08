import {SessionModel} from "../../../db-models/SessionModel";
import {Request} from 'express';
import {CLIENT_USER_NAME, USER_NAME} from "@ranjodhbirkaur/common";
import {PRODUCTION_ENV} from "@ranjodhbirkaur/constants";

interface CreateNewSession {
    existingUser: {
        jwtId: string;
    },
    userType: string;
    responseData: {
        [USER_NAME]: string;
        [CLIENT_USER_NAME]: string;
    },
    req: Request
}

export function createNewSession(data: CreateNewSession) {

    const {existingUser, userType, req, responseData} = data;

    return SessionModel.build({
        jwtId: existingUser.jwtId,
        clientType: userType,
        userName: responseData[USER_NAME],
        selectedEnv: PRODUCTION_ENV,
        clientUserName: responseData[CLIENT_USER_NAME],
        selectedApplicationName: '',
        createdAt: new Date(),
        userAgent: req.useragent,
        isActive: true
    });
}
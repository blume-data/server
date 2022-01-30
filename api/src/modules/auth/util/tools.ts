import {SessionModel} from "../../../db-models/SessionModel";
import {Request, Response} from 'express';
import {CLIENT_USER_NAME, NOT_AUTHORISED_STATUS, sendSingleError} from "../../../util/common-module";
import {PRODUCTION_ENV, USER_NAME} from "@ranjodhbirkaur/constants";
import { InvalidLoginCredentialsMessage } from "./errorMessages";

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

export function handleWrongCredentials(res: Response) {
    return sendSingleError({
        res,
        message: InvalidLoginCredentialsMessage,
        code: NOT_AUTHORISED_STATUS
      });
}
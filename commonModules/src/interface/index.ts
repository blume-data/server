import {AUTH_TOKEN, clientType, JWT_ID, USER_NAME} from "../utils";

export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface JwtPayloadType{
    [clientType]: string;
    [USER_NAME]: string;
    [JWT_ID]: string;
}

export interface PayloadResponseType {
    clientUserName: string;
    [AUTH_TOKEN]: string;
    [USER_NAME]: string;
    clientType: string;
    applicationNames: string;
}

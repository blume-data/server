import {APPLICATION_NAMES, CLIENT_USER_NAME, clientType, JWT_ID, USER_NAME} from "../utils";

export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface JwtPayloadType{
    [clientType]: string;
    [USER_NAME]: string;
    [JWT_ID]: string;
}

export interface ApplicationNameType {
    name: string;
    languages: string[];
}

export interface PayloadResponseType {
    [CLIENT_USER_NAME]: string;
    [USER_NAME]: string;
    [clientType]: string;
    [APPLICATION_NAMES]: ApplicationNameType[];
}

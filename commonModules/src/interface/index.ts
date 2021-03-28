import {APPLICATION_NAMES, CLIENT_USER_NAME, clientType, JWT_ID, SESSION_ID, USER_NAME, ID} from "../utils";

export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface JwtPayloadType{
    [clientType]: string;
    // username of the person who signed in
    [USER_NAME]: string;
    [JWT_ID]: string;
    // id of person who signed in
    [ID]: string;
    [SESSION_ID]: string;
}

export interface ApplicationNameType {
    name: string;
    languages: string[];
}

export interface PayloadResponseType {
    [CLIENT_USER_NAME]: string;
    [USER_NAME]: string;
    [clientType]: string;
    [ID]: string;
}

import {CLIENT_USER_NAME, JWT_ID, SESSION_ID, ID} from "../utils";

export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface JwtPayloadType{
    clientType: string;
    // username of the person who signed in
    userName: string;
    [JWT_ID]: string;
    // id of person who signed in
    [ID]: string;
    [SESSION_ID]: string;
    userGroupIds: [string]
}

export interface ApplicationNameType {
    name: string;
    languages: string[];
}

export interface PayloadResponseType {
    [CLIENT_USER_NAME]: string;
    userName: string;
    clientType: string;
    [ID]: string;
}

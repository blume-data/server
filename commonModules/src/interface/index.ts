import {APPLICATION_NAME, CLIENT_USER_NAME, PERMISSIONS, USER_NAME, ROLE, JWT_ID, FIELD, MESSAGE} from "../utils";

export interface ErrorMessages {
    [FIELD]?: string;
    [MESSAGE]: string;
}

export interface JwtPayloadType {
    [JWT_ID]: string;
    [USER_NAME]: string;
    [ROLE]: string;
    [PERMISSIONS]: string[];
    [CLIENT_USER_NAME]: string;
    [APPLICATION_NAME]: string;
}
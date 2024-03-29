import {ENTRY_UPDATED_AT, ENTRY_UPDATED_BY, STATUS} from "@ranjodhbirkaur/constants";

export const CLIENT_USER_NAME = 'clientUserName';
export const APPLICATION_NAME = 'applicationName';
export const PERMISSIONS = 'permissions';
export const LANGUAGE = 'language';
export const ROLE = 'role';
export const ID = '_id';
export const JWT_ID = 'jwtId';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const EMAIL = 'email';
export const PASSWORD = 'password';
export const Is_Enabled = 'isEnabled';

// array of application names of the client user
export const APPLICATION_NAMES = 'applicationNames';
export const SESSION_ID = 'sessionId';

// properties outside in custom model
export const SKIP_PROPERTIES_IN_ENTRIES = [ENTRY_UPDATED_BY, ENTRY_UPDATED_AT, STATUS, 'id'];

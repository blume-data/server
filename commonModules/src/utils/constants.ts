export const AUTH_TOKEN = 'AUTH_TOKEN';
export const AUTHORIZATION_TOKEN = 'authorization';
export const USER_NAME = 'userName';

export const adminUserType = 'admin';
export const superVisorUserType = 'supervisor';
export const supportUserType = 'support';
export const clientUserType = 'main';// client user
export const freeUserType = 'free-user';// free user
export const SupportedUserType = [adminUserType, clientUserType, freeUserType, superVisorUserType, supportUserType];
export const SUPPORTED_CLIENT_USER_TYPE = [clientUserType, superVisorUserType, supportUserType];

// used to define the type of admin a mongoose model property
export const adminType = 'adminType';
export const clientType = 'clientType';

export const EVENTS_ROUTE = 'events';
export const EVENT_AUTH_NEW_JWT = 'EVENT_AUTH_NEW_JWT';
export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_NAME = 'userName';

export const adminUserType = 'admin';
export const superVisorUserType = 'supervisor';
export const supportUserType = 'support';
export const clientUserType = 'client';// client user
export const freeUserType = 'user';// free user
export const SupportedUserType = [adminUserType, clientUserType, freeUserType, superVisorUserType, supportUserType];

// used to define the type of admin a mongoose model property
export const adminType = 'adminType';

export const EVENTS_ROUTE = 'events';
export const EVENT_AUTH_NEW_JWT = 'EVENT_AUTH_NEW_JWT';
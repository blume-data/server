import {clusterUrl, rootUrl} from "./constants";

export const signUp = `${rootUrl}/:userType/get-started`;
export const signOutUrl = `${rootUrl}/:userType/sign-out`;
export const signIn = `${rootUrl}/:userType/log-in`;
export const currentUserUrl = `${rootUrl}/:userType/current-user`;
export const emailVerificationUrl = rootUrl+'/:userType/email-verification';
export const userNameValidationUrl = `${rootUrl}/:userType/username-validation`;

export const clusterCheckUser = `${clusterUrl}/check`;
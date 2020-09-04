import {clusterUrl} from "./constants";

export const clusterCheckUser = `${clusterUrl}/check`;

export const authRootUrl = `/auth`;

export const register = 'sign-up';
export const signUpUrl = `${authRootUrl}/:userType/${register}`;

export const logOut = 'sign-out';
export const signOutUrl = `${authRootUrl}/:userType/${logOut}`;

export const logIn = 'log-in';
export const signInUrl = `${authRootUrl}/:userType/${logIn}`;

export const currentUser = 'current-user';
export const currentUserUrl = `${authRootUrl}/:userType/${currentUser}`;

export const emailVerification = 'email-verification';
export const emailVerificationUrl = `${authRootUrl}/:userType/${emailVerification}`;

export const userNameValidation = 'username-validation';
export const userNameValidationUrl = `${authRootUrl}/:userType/${userNameValidation}`;
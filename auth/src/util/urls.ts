import {clusterUrl, rootUrl} from "./constants";

export const register = 'sign-up';
export const signUpUrl = `${rootUrl}/:userType/${register}`;

export const logOut = 'sign-out';
export const signOutUrl = `${rootUrl}/:userType/${logOut}`;

export const logIn = 'log-in';
export const signInUrl = `${rootUrl}/:userType/${logIn}`;

export const currentUser = 'current-user';
export const currentUserUrl = `${rootUrl}/:userType/${currentUser}`;

export const emailVerification = 'email-verification';
export const emailVerificationUrl = `${rootUrl}/:userType/${emailVerification}`;

export const userNameValidation = 'username-validation';
export const userNameValidationUrl = `${rootUrl}/:userType/${userNameValidation}`;

export const clusterCheckUser = `${clusterUrl}/check`;
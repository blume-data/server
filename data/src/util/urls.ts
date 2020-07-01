import {rootUrl} from "./constants";

export const CollectionUrl = `${rootUrl}/:username/collection`;

export const signOutUrl = `${rootUrl}/client/signout`;
export const signIn = `${rootUrl}/client/signin`;
export const currentUserUrl = `${rootUrl}/client/currentuser`;
export const emailVerificationUrl = rootUrl+'/client/email-verification';
export const userNameValidationUrl = `${rootUrl}/client/username-validation`;
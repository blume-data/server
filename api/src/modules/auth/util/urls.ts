import { APPLICATION_NAME, CLIENT_USER_NAME, ENV } from "@ranjodhbirkaur/constants";
import {clusterUrl} from "./constants";

export const clusterCheckUser = `${clusterUrl}/check`;

export const authRootUrl = `/api/auth`;

export const addressUrls = 'routes';

export const getAddressUrls = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/${addressUrls}`
    }
    return `${authRootUrl}/${addressUrls}`
};

export const addressUrlsUrl = `${authRootUrl}/${addressUrls}`;

export const register = 'sign-up';
export const signUpUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${register}`
    }
    return `${authRootUrl}/${userType}/${register}`
};

export const logOut = 'sign-out';
export const signOutUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${logOut}`
    }
    return `${authRootUrl}/${userType}/${logOut}`
};

export const logIn = 'log-in';
export const signInUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${logIn}`
    }
    return `${authRootUrl}/${userType}/${logIn}`
};

export const currentUser = 'current-user';
export const currentUserUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${currentUser}`
    }
    return `${authRootUrl}/${userType}/${currentUser}`
};

export const emailVerification = 'email-verification';
export const emailVerificationUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${emailVerification}`
    }
    return `${authRootUrl}/${userType}/${emailVerification}`
};

export const userNameValidation = 'username-validation';
export const userNameValidationUrl = (userType?: string) => {
    if (!userType) {
        return `${authRootUrl}/:userType/${userNameValidation}`
    }
    return `${authRootUrl}/${userType}/${userNameValidation}`
};

export const roleRoute = 'role';
export const roleUrl = (userName?: string) => {
    if (!userName) {
        return `${authRootUrl}/:userName/${roleRoute}`
    }
    return `${authRootUrl}/${userName}/${roleRoute}`
};

export const EnvUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/env`;

export const CreateOtherUsersUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/:${ENV}/user`;
export const CreateUserGroupUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/:${ENV}/user-group`;
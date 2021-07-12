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
export const signUpUrl = `${authRootUrl}/:userType/${register}`;

export const logOut = 'sign-out';
export const signOutUrl = `${authRootUrl}/${logOut}`;

export const logIn = 'log-in';

export const signInUrl = `${authRootUrl}/${logIn}`;

export const currentUser = 'current-user';
export const currentUserUrl = `${authRootUrl}/${currentUser}`;

export const emailVerification = 'email-verification';
export const emailVerificationUrl = `${authRootUrl}/${emailVerification}`;

export const userNameValidation = 'username-validation';
export const userNameValidationUrl = `${authRootUrl}/${userNameValidation}`;

export const roleRoute = 'role';
export const roleUrl = `${authRootUrl}/${roleRoute}`;

export const EnvUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/env`;

export const CreateOtherUsersUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/:${ENV}/user`;
export const CreateUserGroupUrl = `${authRootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/:${ENV}/user-group`;
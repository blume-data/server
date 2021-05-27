import { APPLICATION_NAME, CLIENT_USER_NAME, ENV } from "@ranjodhbirkaur/constants";
import { getBaseUrl } from "../urls";

export const env = process.env.NODE_ENV;

export const LOCAL_STORAGE_ENV = 'LOCAL_STORAGE_ENV';
export const LOCAL_STORAGE_LANGUAGE = 'LOCAL_STORAGE_LANGUAGE';
export const LOCAL_STORAGE_SELECTED_APPLICATION_NAME = 'LOCAL_STORAGE_SELECTED_APPLICATION_NAME';

const AUTH_ROOT_URL = '/api/auth'

export const AUTH_ROUTES = {
    authRootUrl: AUTH_ROOT_URL,
    currentUser: "current-user",
    emailVerification: "email-verification",
    logIn: "log-in",
    logOut: "sign-out",
    register: "sign-up",
    userNameValidation: "username-validation",
    envUrl: `${getBaseUrl()}${AUTH_ROOT_URL}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/env`,
    userGroupUrl: `${getBaseUrl()}${AUTH_ROOT_URL}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/:${ENV}/create-user-group`

}

export const DATA_ROUTES = {
    ApplicationNameUrl: "/api/data/:clientUserName/application-space/:applicationName?",
    CollectionUrl: "/api/data/:env/:clientUserName/:applicationName/models",
    GetCollectionNamesUrl: "/api/data/:env/:clientUserName/:applicationName/get-models",
    GetEntriesUrl: "/api/data/:env/:language/:clientUserName/:applicationName/entry/:modelName/get-entries",
    RoleUrl: "/api/data/:env/:userName/role/:roleName?",
    StoreUrl: "/api/data/:env/:language/:clientUserName/:applicationName/entry/:modelName",
}

export const ASSETS_ROUTE = {
    AssetsGetAssetsDataUrl: "/api/assets/:clientUserName/asset",
    authAssets: "/api/assets/:clientUserName/secure-assets",
    getAsset: "/api/assets/:clientUserName/get/asset",
    getAssets: "/api/assets/:clientUserName",
    createTempRecord: "/api/assets/:clientUserName/create-temp-record",
    verifyTempRecord: "/api/assets/:clientUserName/verify-temp-record",
    verifyAssets: "/api/assets/:clientUserName/verify-url"
}
export const env = process.env.NODE_ENV;

export const LOCAL_STORAGE_ENV = 'LOCAL_STORAGE_ENV';
export const LOCAL_STORAGE_LANGUAGE = 'LOCAL_STORAGE_LANGUAGE';
export const LOCAL_STORAGE_SELECTED_APPLICATION_NAME = 'LOCAL_STORAGE_SELECTED_APPLICATION_NAME';

export const AUTH_ROUTES = {
    authRootUrl: "/auth-api",
    currentUser: "current-user",
    emailVerification: "email-verification",
    logIn: "log-in",
    logOut: "sign-out",
    register: "sign-up",
    userNameValidation: "username-validation",
}

export const DATA_ROUTES = {
    ApplicationNameUrl: "/data-api/:clientUserName/application-space/:applicationName?",
    CollectionUrl: "/data-api/:env/:clientUserName/:applicationName/models",
    GetCollectionNamesUrl: "/data-api/:env/:clientUserName/:applicationName/get-models",
    GetEntriesUrl: "/data-api/:env/:language/:clientUserName/:applicationName/entry/:modelName/get-entries",
    RoleUrl: "/data-api/:env/:userName/role/:roleName?",
    StoreUrl: "/data-api/:env/:language/:clientUserName/:applicationName/entry/:modelName",
}

export const ASSETS_ROUTE = {
    AssetsGetAssetsDataUrl: "/assets-api/:clientUserName/asset",
    authAssets: "/assets-api/:clientUserName/secure-assets",
    getAsset: "/assets-api/:clientUserName/get/asset",
    getAssets: "/assets-api/:clientUserName",
    createTempRecord: "/assets-api/:clientUserName/create-temp-record",
    verifyTempRecord: "/assets-api/:clientUserName/verify-temp-record",
    verifyAssets: "/assets-api/:clientUserName/verify-url"
}
export const env = process.env.NODE_ENV;

export const LOCAL_STORAGE_ENV = 'LOCAL_STORAGE_ENV';
export const LOCAL_STORAGE_LANGUAGE = 'LOCAL_STORAGE_LANGUAGE';
export const LOCAL_STORAGE_SELECTED_APPLICATION_NAME = 'LOCAL_STORAGE_SELECTED_APPLICATION_NAME';
export const LOCAL_STORAGE_REDIRECT_URL = 'LOCAL_STORAGE_REDIRECT_URL';

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
    t_s_4_6_3_t: "/assets-api/:clientUserName/sdf-198-sdf-410",
    v_3_5_6: "/assets-api/:clientUserName/sdf-wer-234-sdf",
    verifyAssets: "/assets-api/:clientUserName/verify-url"
}
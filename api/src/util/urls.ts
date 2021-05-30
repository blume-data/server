import { APPLICATION_NAME, CLIENT_USER_NAME } from "./common-module";
import {rootUrl, serviceName} from "./constants";

export const dataRouteUrls = `${serviceName}/routes`;

export const ApplicationNameUrl = `${serviceName}/:clientUserName/application-space/:applicationName?`;

export const CollectionUrl = `${rootUrl}/:clientUserName/:applicationName/models`;

export const GetCollectionNamesUrl = `${rootUrl}/:clientUserName/:applicationName/get-models`;

export const StoreUrl = `${rootUrl}/:language/:clientUserName/:applicationName/entry/:modelName`;
export const GetEntriesUrl = `${StoreUrl}/get-entries`;

export const StoreReferenceUrl = `${rootUrl}/:language/:clientUserName/:applicationName/entry/:modelName`;

// same setting for all languages
export const SettingUrl = `${rootUrl}/:${CLIENT_USER_NAME}/:${APPLICATION_NAME}/setting`;

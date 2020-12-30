import {rootUrl, serviceName} from "./constants";

export const dataRouteUrls = `${serviceName}/routes`;

export const RoleUrl = `${rootUrl}/:userName/role/:roleName?`;

export const ApplicationNameUrl = `${serviceName}/:clientUserName/application-space/:applicationName?`;

export const CollectionUrl = `${rootUrl}/:clientUserName/:applicationName/models`;

export const GetCollectionNamesUrl = `${rootUrl}/:clientUserName/:applicationName/get-models`;

export const StoreUrl = `${rootUrl}/:language/:clientUserName/:applicationName/entry/:modelName`;

export const StoreReferenceUrl = `${rootUrl}/:language/:clientUserName/:applicationName/entry/:modelName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';

export const dataBaseRootUrl = `http://database-srv:3000/store`;

export const schemaDataBaseUrl = 'schema';
export const getDataBaseUrl = 'get';
export const addDataBaseUrl = 'add';
import {rootUrl, serviceName} from "./constants";

export const dataRouteUrls = `${serviceName}/routes`;

export const RoleUrl = `${rootUrl}/:userName/role/:roleName?`;

export const ApplicationNameUrl = `${serviceName}/:clientUserName/application-name/:applicationName?`;

export const CollectionUrl = `${rootUrl}/:language/:clientUserName/:applicationName/collection`;
export const GetCollectionNamesUrl = `${rootUrl}/:language/:clientUserName/:applicationName/get-collection-names`;

export const StoreUrl = `${rootUrl}/:language/:clientUserName/:applicationName/collection/:collectionName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';

export const dataBaseRootUrl = `http://database-srv:3000/store`;
export const schemaDataBaseUrl = 'schema';
export const getDataBaseUrl = 'get';
export const addDataBaseUrl = 'add';
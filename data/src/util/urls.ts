import {rootUrl, serviceName} from "./constants";

export const dataRouteUrls = `${serviceName}/routes`;

export const RoleUrl = `${rootUrl}/:userName/role/:roleName?`;

export const ApplicationNameUrl = `${rootUrl}/:userName/application-name/:applicationName?`;

export const PermissionUrl = `${rootUrl}/:userName/permission/:permissionName?`;

export const CollectionUrl = `${rootUrl}/:language/:userName/collection`;

export const StoreUrl = `${rootUrl}/:language/:userName/collection/:collectionName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';

export const dataBaseRootUrl = `http://database-srv:3000/store`;
export const schemaDataBaseUrl = 'schema';
export const getDataBaseUrl = 'get';
export const addDataBaseUrl = 'add';
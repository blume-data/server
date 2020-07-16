import {rootUrl} from "./constants";

const ENV = '/:env';

export const RoleUrl = `${rootUrl}${ENV}/:userName/role/:roleName?`;
export const PermissionUrl = `${rootUrl}${ENV}/:userName/permission/:permissionName?`;

export const CollectionUrl = `${rootUrl}${ENV}/:language/:userName/collection`;
export const StoreUrl = `${rootUrl}${ENV}/:language/:userName/collection/:collectionName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';
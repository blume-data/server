import {rootUrl} from "./constants";

export const RoleUrl = `${rootUrl}/:userName/role/:roleName?`;
export const PermissionUrl = `${rootUrl}/:userName/permission/:permissionName?`;

export const CollectionUrl = `${rootUrl}/:language/:userName/collection`;
console.log('CollectionUrl', CollectionUrl);
export const StoreUrl = `${rootUrl}/:language/:userName/collection/:collectionName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';
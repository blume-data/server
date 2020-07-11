import {rootUrl} from "./constants";

export const RoleUrl = `${rootUrl}/:userName/role/`;

export const CollectionUrl = `${rootUrl}/:language/:userName/collection`;
export const StoreUrl = `${rootUrl}/:language/:userName/collection/:collectionName`;

export const AUTH_SRV_URL = 'http://auth-srv:3000/events';
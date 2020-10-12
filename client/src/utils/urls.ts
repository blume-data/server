import {ROOT_URL} from "./config";

export function getBaseUrl() {
    return ROOT_URL;
}

export function getAuthRoutes() {
    return `${getBaseUrl()}/auth/routes/`;
}

export function getDataRoutes() {
    return `${getBaseUrl()}/data/routes/`;
}

export const dashboardHomeUrl = '/dashboard/home';
export const dashboardApplicationNamesUrl = '/dashboard/application-names';
export const dashboardApplicationNameUrl = '/dashboard/:applicationName/application-name';
export const dashboardStoresUrl = '/dashboard/:applicationName/stores';
export const dashboardCollectionsUrl = '/dashboard/:applicationName/stores/:store-name';

export const authUrl = '/auth';
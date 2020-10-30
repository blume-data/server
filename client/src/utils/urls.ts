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
export const dashboardApplicationNamesUrl = '/dashboard/application-space';
export const dashboardApplicationNameUrl = '/dashboard/:applicationName/application-space';
export const dashboardDataModelsUrl = '/dashboard/:applicationName/models';
export const dashboardDataEntriesUrl = '/dashboard/:applicationName/entries/:modelName?';

export const authUrl = '/auth';
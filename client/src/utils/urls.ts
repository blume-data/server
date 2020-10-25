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
export const dashboardDataModelUrl = '/dashboard/:applicationName/models/:dataModel';
export const dashboardDataEntriesUrl = '/dashboard/:applicationName/entries';
export const dashboardDataEntryUrl = '/dashboard/:applicationName/entry/:dataEntryId';

export const authUrl = '/auth';
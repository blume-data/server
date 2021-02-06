import {ROOT_URL} from "./config";

export function getBaseUrl() {
    return ROOT_URL;
}

export function getAssetsRoutes() {
    return `${getBaseUrl()}/assets-api/routes`;
}

export function getAuthRoutes() {
    return `${getBaseUrl()}/auth-api/routes/`;
}

export function getDataRoutes() {
    return `${getBaseUrl()}/data-api/routes/`;
}
export const APP_ROOT_URL = '/';
export const dashboardHomeUrl = `${APP_ROOT_URL}dashboard/home`;

export const dashboardApplicationNamesUrl = `${APP_ROOT_URL}dashboard/application-space`;
export const dashboardApplicationNameUrl = `${APP_ROOT_URL}dashboard/:applicationName/application-space`;

export const dashboardDataModelsUrl = `${APP_ROOT_URL}dashboard/:applicationName/models`;
export const dashboardCreateDataModelsUrl = `${APP_ROOT_URL}dashboard/:applicationName/create-model`;

export const dashboardDataEntriesUrl = `${APP_ROOT_URL}dashboard/:applicationName/entries/:modelName?`;
export const dashboardCreateDataEntryUrl = `${APP_ROOT_URL}dashboard/:applicationName/create-entry/:modelName`;

export const authUrl = `${APP_ROOT_URL}secure`;

export const assetsUrl = `${APP_ROOT_URL}assets`;
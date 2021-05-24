import {ROOT_URL} from "./config";

export function getBaseUrl() {
    return ROOT_URL;
}

export const APP_ROOT_URL = '/';
export const dashboardHomeUrl = `${APP_ROOT_URL}dashboard/home`;

export const dashboardApplicationNamesUrl = `${APP_ROOT_URL}dashboard/application-space`;
export const dashboardApplicationNameUrl = `${APP_ROOT_URL}dashboard/:applicationName/application-space`;

export const dashboardEnvUrl = `${APP_ROOT_URL}dashboard/:applicationName/env`;

export const dashbaordUserUrl = `${APP_ROOT_URL}dashboard/:applicationName/:env/users`;

export const dashboardDataModelsUrl = `${APP_ROOT_URL}dashboard/:applicationName/models`;
export const dashboardCreateDataModelsUrl = `${APP_ROOT_URL}dashboard/:applicationName/model`;

export const dashboardDataEntriesUrl = `${APP_ROOT_URL}dashboard/:applicationName/entries/:modelName?`;
export const dashboardCreateDataEntryUrl = `${APP_ROOT_URL}dashboard/:applicationName/entry/:modelName/:id?`;

export const authUrl = `${APP_ROOT_URL}secure`;

export const assetsUrl = `${APP_ROOT_URL}assets`;
export function getBaseUrl() {
    return `https://dev.ranjod.com`;
}

export function getAuthRoutes() {
    return `${getBaseUrl()}/auth/routes/`;
}

export function getDataRoutes() {
    return `${getBaseUrl()}/data/routes/`;
}

export const dashboardHomeUrl = '/dashboard/home';
export const dashboardApplicationNamesUrl = '/dashboard/application-names';
export const applicationNameUrl = '/dashboard/:applicationName';
export const authUrl = '/auth';
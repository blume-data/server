export const getNewsUrl = '';
const authRootUrl = '';

export function getBaseUrl() {
    return `https://dev.blumedata.store`;
}

export function getRouteAddressesUrl() {
    return `${getBaseUrl()}/auth/client/auth-routes/`
}

export function getAuthUrl(userType: string) {
    return `${getBaseUrl()}${authRootUrl}/${userType}`;
}
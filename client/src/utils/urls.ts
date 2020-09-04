export const getNewsUrl = '';
const authRootUrl = '';

export function getBaseUrl() {
    return `https://dev.blumedata.store`;
}

export function getAuthUrl(userType: string) {
    return `${getBaseUrl()}${authRootUrl}/${userType}`;
}
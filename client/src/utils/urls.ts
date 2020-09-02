import {authRootUrl} from "@ranjodhbirkaur/common/build/urls/modules/auth";

export const getNewsUrl = '';

export function getBaseUrl() {
    return `https://dev.blumedata.store`;
}

export function getAuthUrl(userType: string) {
    return `${getBaseUrl()}${authRootUrl}/${userType}`;
}
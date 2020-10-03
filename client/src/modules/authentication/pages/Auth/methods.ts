import {AUTH_TOKEN, USER_NAME, APPLICATION_NAMES, APPLICATION_NAME, clientType} from "@ranjodhbirkaur/constants";

interface SaveAuthenticationType {
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
    [APPLICATION_NAMES]?: string;
    [APPLICATION_NAME]?: string;
    [clientType]?: string;
}

export function saveAuthentication(response: SaveAuthenticationType) {
    if(response[APPLICATION_NAMES]) {
        localStorage.setItem(APPLICATION_NAMES, JSON.stringify(response[APPLICATION_NAMES]) || JSON.stringify(['']));
    }
    if(response[APPLICATION_NAME]) {
        localStorage.setItem(APPLICATION_NAME, response[APPLICATION_NAME] || '');
    }
    if(response[clientType]) {
        localStorage.setItem(clientType, response[clientType] || '');
    }
    localStorage.setItem(AUTH_TOKEN, response[AUTH_TOKEN] || '');
    localStorage.setItem(USER_NAME, response[USER_NAME] || '');
}

export function checkAuthentication(): boolean {
    try {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        const userName = localStorage.getItem(USER_NAME);
        return !!(authToken && userName);
    }
    catch (e) {
        return true;
    }
}

export function clearAuthentication() {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(APPLICATION_NAMES);
    localStorage.removeItem(USER_NAME);
}
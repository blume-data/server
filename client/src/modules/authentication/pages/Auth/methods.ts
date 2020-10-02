import {AUTH_TOKEN, USER_NAME} from "@ranjodhbirkaur/constants";
import {APPLICATION_NAMES} from "../../../../utils/constants";

interface SaveAuthenticationType {
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
    [APPLICATION_NAMES]?: string;
}

export function saveAuthentication(response: SaveAuthenticationType) {
    if(response[APPLICATION_NAMES]) {
        localStorage.setItem(APPLICATION_NAMES, JSON.stringify(response[APPLICATION_NAMES]) || JSON.stringify(['']));
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
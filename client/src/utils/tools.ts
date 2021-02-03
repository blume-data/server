import {APPLICATION_NAME, APPLICATION_NAMES, CLIENT_USER_NAME, EnglishLanguage} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "./baseApi";
import {getBaseUrl} from "./urls";

export const randomString = () => {
    return Math.random().toString(36).substring(10);
};

export function isUserLoggedIn() {
    return false;
}

export function getItemFromLocalStorage(key: string) {
    try {
        return localStorage.getItem(key);
    }
    catch (e) {
        return null;
    }
}

export function getApplicationNamesLocalStorage() {
    const s = getItemFromLocalStorage(APPLICATION_NAMES);
    if(s) {
        return JSON.parse(s).map((item: {name: string}) => item.name);
    }
    else {
        return ['']
    }
}

interface GetModelData {
    GetCollectionNamesUrl: string;
    clientUserName: string;
    setIsLoading: (action: boolean) => void;
    env: string;
    language: string;
    applicationName: string;
    modelName: string;
    setRules: any;
}
// Fetch model rules, description
export async function getModelDataAndRules(data: GetModelData) {
    const {GetCollectionNamesUrl, clientUserName, setIsLoading, applicationName, env, language, modelName, setRules} = data;
    setIsLoading(true);
    const url = GetCollectionNamesUrl
        .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
        .replace(':env', env)
        .replace(':language', language)
        .replace(`:${APPLICATION_NAME}`,applicationName);

    const response = await doGetRequest(
        `${getBaseUrl()}${url}?name=${modelName ? modelName : ''}`,
        {},
        true
    );
    if(response && !response.errors && response.length) {
        setRules(JSON.parse(response[0].rules));
    }
    setIsLoading(false);
}
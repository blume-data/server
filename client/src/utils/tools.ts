import {
    APPLICATION_NAME,
    APPLICATION_NAMES,
    CLIENT_USER_NAME,
    ENTRY_UPDATED_BY,
    FIRST_NAME,
    LAST_NAME
} from "@ranjodhbirkaur/constants";
import {doGetRequest, doPostRequest} from "./baseApi";
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
    env: string;
    language: string;
    applicationName: string;
    modelName?: string;
    getOnly?: string;
}
// Fetch model rules, description
export async function getModelDataAndRules(data: GetModelData) {
    const {GetCollectionNamesUrl, applicationName, env, language, modelName='', getOnly} = data;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const url = GetCollectionNamesUrl
        .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
        .replace(':env', env)
        .replace(':language', language)
        .replace(`:${APPLICATION_NAME}`,applicationName);

    const curl = `${getBaseUrl()}${url}?name=${modelName}${getOnly ? `&get=${getOnly}` : ''}`;
    return  await doGetRequest(
        curl,
        {},
        true
    );
}

interface FetchModelEntriesType {
    env: string;
    language: string;
    applicationName: string;
    modelName: string;
    GetEntriesUrl: string;
    where?: object;
}
// Fetch model entries
export async function fetchModelEntries(data: FetchModelEntriesType) {

    const {env, language, applicationName, modelName, GetEntriesUrl, where} = data;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const url = GetEntriesUrl
        .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
        .replace(':env', env)
        .replace(':language', language)
        .replace(':modelName', modelName)
        .replace(`:${APPLICATION_NAME}`,applicationName);

    return await doPostRequest(`${getBaseUrl()}${url}`, {
        where,
        populate: [
            {
                name: ENTRY_UPDATED_BY,
                getOnly: [FIRST_NAME, LAST_NAME]
            }
        ]
    }, true);
}
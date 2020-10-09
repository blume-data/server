import axios, {AxiosRequestConfig} from 'axios';
import {getItemFromLocalStorage, isUserLoggedIn} from "./tools";
import {AUTH_TOKEN} from "@ranjodhbirkaur/constants";

const axiosInstance = axios.create({
    timeout: 30000
});

const authOptions = () => {
    return {
        headers: {
            'Authorization' : getItemFromLocalStorage(AUTH_TOKEN)
        }
    }
};

export function makeRequest(uri: string, options: AxiosRequestConfig, isAuthRequest = false) {

    if (isAuthRequest) {
        options = Object.assign(options, authOptions());
    }
    const apiParams = Object.assign({ url : uri }, options);

    return axiosInstance(apiParams).then(response => {
        return response.data;
    })
        .catch(error => {
        if (error && error.response && error.response.status >= 400) {
            console.log('auth error')
        }
        return error && error.response && error.response.data;
    })
}

export async function doGetRequest(uri: string, data?: any, isAuthRequest = false,) {

    return await makeRequest(`${uri}`, {data, method: "get"}, isAuthRequest);
}

export async function doPostRequest(uri: string, data: any, isAuthRequest = false,) {

    return await makeRequest(uri, {method: "post", data}, isAuthRequest);
}

export async function doDeleteRequest(uri: string, data: any, isAuthRequest = false,) {

    return await makeRequest(uri, {method: "delete", data}, isAuthRequest);
}

export async function doPutRequest(uri: string, data: any, isAuthRequest = false,) {

    return await makeRequest(uri, {method: "put", data}, isAuthRequest);
}
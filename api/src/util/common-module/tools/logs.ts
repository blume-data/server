import axios from 'axios';
export const RANJODHBIR_KAUR_DATABASE_URL = 'http://database-srv:3000/logs';
export const schemaDataBaseUrl = 'schema';
export const getDataBaseUrl = 'get';
export const addDataBaseUrl = 'add';

export const storeSchemaRanjodhBirData = async (
    modelName: string,
    clientUserName: string,
    applicationName: string
) => {
    const data = {
        modelName,
        clientUserName,
        applicationName
    };
    const response = await axios.post(`${RANJODHBIR_KAUR_DATABASE_URL}/${schemaDataBaseUrl}`, data);
    return response.data;
};

export const writeRanjodhBirData = async (
    modelName: string,
    clientUserName: string,
    applicationName: string,
    language: string,
    storeData: any
) => {

    const data = {modelName, clientUserName, data: storeData, applicationName, language};
    const response = await axios.post(`${RANJODHBIR_KAUR_DATABASE_URL}/${addDataBaseUrl}`, data);
    return response.data;
};

export const getRanjodhBirData = async (
    modelName: string,
    clientUserName: string,
    applicationName: string,
    language: string,
    conditions?: { where?: any; getOnly?: any; skip: number; limit: number }
) => {
    const data = {
        modelName,
        clientUserName,
        conditions,
        applicationName,
        language
    };
    const response = await axios.post(`${RANJODHBIR_KAUR_DATABASE_URL}/${getDataBaseUrl}`, data);
    return response.data;
};
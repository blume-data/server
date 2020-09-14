import axios from 'axios';
import {addDataBaseUrl, dataBaseRootUrl, getDataBaseUrl, schemaDataBaseUrl} from "./urls";

export const storeSchema = async (modelName: string, clientUserName: string, schema: any) => {
    const data = {
        modelName,
        clientUserName,
        schema
    };
    const response = await axios.post(`${dataBaseRootUrl}/${schemaDataBaseUrl}`, data);
    return response.data;
};

export const writeRanjodhBirData = async (modelName: string, clientUserName: string, storeData: any) => {
    const data = {
        modelName,
        clientUserName,
        data: storeData
    };
    const response = await axios.post(`${dataBaseRootUrl}/${addDataBaseUrl}`, data);
    return response.data;
};

export const getRanjodhBirData = async (modelName: string, clientUserName: string, conditions?: {
    where?: any;
    getOnly?: string[];
    skip: number;
    perPage: number
}) => {
    const data = {
        modelName,
        clientUserName,
        conditions
    };
    const response = await axios.post(`${dataBaseRootUrl}/${getDataBaseUrl}`, data);
    return response.data;
};
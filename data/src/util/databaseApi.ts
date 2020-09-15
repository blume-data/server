import axios from 'axios';
import {addDataBaseUrl, dataBaseRootUrl, getDataBaseUrl, schemaDataBaseUrl} from "./urls";

export const storeSchema = async (modelName: string, clientUserName: string, connectionName: string) => {
    const data = {
        modelName,
        clientUserName,
        connectionName
    };
    const response = await axios.post(`${dataBaseRootUrl}/${schemaDataBaseUrl}`, data);
    return response.data;
};

export const writeRanjodhBirData = async (modelName: string, clientUserName: string,
                                          connectionName: string, storeData: any) => {

    const data = {modelName, clientUserName, connectionName, data: storeData};
    const response = await axios.post(`${dataBaseRootUrl}/${addDataBaseUrl}`, data);
    return response.data;
};

export const getRanjodhBirData = async (modelName: string,
                                        clientUserName: string,
                                        connectionName: string,
                                        conditions?: { where?: any; getOnly?: string[]; pageNo: number; perPage: number }) => {
    const data = {
        modelName,
        clientUserName,
        connectionName,
        conditions
    };
    const response = await axios.post(`${dataBaseRootUrl}/${getDataBaseUrl}`, data);
    return response.data;
};
import axios from 'axios';
import {addDataBaseUrl, dataBaseRootUrl, getDataBaseUrl, schemaDataBaseUrl} from "./urls";

export const storeSchema = async (modelName: string, clientUserName: string, connectionName: string, containerName: string) => {
    const data = {
        modelName,
        clientUserName,
        containerName
    };
    const response = await axios.post(`${connectionName}/${schemaDataBaseUrl}`, data);
    return response.data;
};

export const writeRanjodhBirData = async (modelName: string, clientUserName: string,
                                          connectionName: string, containerName: string, storeData: any) => {

    const data = {modelName, clientUserName, containerName, data: storeData};
    const response = await axios.post(`${connectionName}/${addDataBaseUrl}`, data);
    return response.data;
};

export const getRanjodhBirData = async (modelName: string,
                                        clientUserName: string,
                                        connectionName: string,
                                        containerName: string,
                                        conditions?: { where?: any; getOnly?: string[]; pageNo: number; perPage: number }) => {
    const data = {
        modelName,
        clientUserName,
        containerName,
        conditions
    };
    const response = await axios.post(`${connectionName}/${getDataBaseUrl}`, data);
    return response.data;
};
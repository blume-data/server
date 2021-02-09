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

interface UploadImagesType{
    e: any,
    t_s_4_6_3_t: string;
    clientUserName: string;
    v_3_5_6: string;
    imagekit: any;
    setLoading?: (status: boolean) => void;

}

export async function uploadImages(data: UploadImagesType) {

    const {e, t_s_4_6_3_t, clientUserName, v_3_5_6, imagekit, setLoading} = data;
    const uploadedFiles: {tbU: string, name: string}[] = [];
    const files = e.target.files;
    if(setLoading) setLoading(true);
    if(files && files.length) {
        for (const file of files) {
            const r945 = t_s_4_6_3_t.replace(`:${CLIENT_USER_NAME}`, clientUserName);
            const r43 = v_3_5_6.replace(`:${CLIENT_USER_NAME}`, clientUserName);

            const t_0 = await doPostRequest(`${getBaseUrl()}${r945}`, {
                fileName: file.name
            }, true);

            imagekit.upload({
                file,
                fileName: file.name,
                tags: ["tag1"],
                isPrivateFile: true
            }, async function(err: any, result: any) {
                await doPostRequest(`${getBaseUrl()}${r43}`, {
                    di_98: t_0,
                    emanelif_89: result.name,
                    htap_21: result.filePath,
                    tu: result.thumbnailUrl,
                    h: result.height,
                    w: result.width,
                    s: result.size,
                    ty: result.fileType,
                    dilife: result.fileId
                });
                uploadedFiles.push({
                    name: result.filePath,
                    tbU: result.thumbnailUrl
                });
            });
        }
    }
    console.log('uploaded files', uploadedFiles);
    if(setLoading) setLoading(false);

    return uploadedFiles;

}
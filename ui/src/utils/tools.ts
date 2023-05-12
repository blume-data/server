import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  ENTRY_UPDATED_BY,
  FIRST_NAME,
  LAST_NAME,
} from "@ranjodhbirkaur/constants";
import { doDeleteRequest, doGetRequest, doPostRequest } from "./baseApi";
import { getBaseUrl } from "./urls";

export const randomString = () => {
  return Math.random().toString(36).substring(10);
};

export function isUserLoggedIn() {
  return false;
}

export function getItemFromLocalStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function getUrlSearchParams(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

interface GetModelData {
  GetCollectionNamesUrl: string;
  env: string;
  language: string;
  applicationName: string;
  modelName?: string;
  getOnly?: string;
  persistData?: {
    updateStore?: any;
    name?: string;
  };
}
// Fetch model rules, description
export async function getModelDataAndRules(data: GetModelData) {
  const {
    GetCollectionNamesUrl,
    applicationName,
    env,
    language,
    modelName = "",
    getOnly,
    persistData,
  } = data;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

  const url = GetCollectionNamesUrl.replace(
    `:${CLIENT_USER_NAME}`,
    clientUserName ? clientUserName : ""
  )
    .replace(":env", env)
    .replace(":language", language)
    .replace(`:${APPLICATION_NAME}`, applicationName);

  console.log("GetCollectionNamesUrl", url, GetCollectionNamesUrl);
  const curl = `${getBaseUrl()}${url}?name=${modelName}${
    getOnly ? `&get=${getOnly}` : ""
  }`;
  if (persistData?.updateStore) {
    persistData?.updateStore({
      fetcher: async () => {
        return await doGetRequest(curl, {}, true);
      },
      name: persistData.name ? persistData.name : "ModelDataAndRules",
      checkForUpdate: false,
    });
  } else {
    return await doGetRequest(curl, {}, true);
  }
}

interface FetchModelEntriesType {
  env: string;
  language: string;
  applicationName: string;
  modelName: string;
  GetEntriesUrl: string;
  where?: object;
  match?: object;
  getOnly?: string[];
  populate?: boolean;
}

interface DeleteModelEntriesType {
  env: string;
  language: string;
  applicationName: string;
  modelName: string;
  StoreUrl: string;
  where?: object;
}

// Fetch model entries
export async function fetchModelEntries(data: FetchModelEntriesType) {
  const {
    env,
    populate = true,
    language,
    applicationName,
    modelName,
    GetEntriesUrl,
    where,
    match,
    getOnly,
  } = data;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

  const populateData = populate
    ? [
        {
          name: ENTRY_UPDATED_BY,
          getOnly: [FIRST_NAME, LAST_NAME],
        },
      ]
    : undefined;

  const url = GetEntriesUrl.replace(
    `:${CLIENT_USER_NAME}`,
    clientUserName ? clientUserName : ""
  )
    .replace(":env", env)
    .replace(":language", language)
    .replace(":modelName", modelName)
    .replace(`:${APPLICATION_NAME}`, applicationName);

  return await doPostRequest(
    `${getBaseUrl()}${url}`,
    {
      where,
      match,
      getOnly,
      populate: populateData,
    },
    true
  );
}

export async function deleteModelEntries(data: DeleteModelEntriesType) {
  const { env, language, applicationName, modelName, StoreUrl, where } = data;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
  const url = StoreUrl.replace(
    `:${CLIENT_USER_NAME}`,
    clientUserName ? clientUserName : ""
  )
    .replace(":env", env)
    .replace(":language", language)
    .replace(":modelName", modelName)
    .replace(`:${APPLICATION_NAME}`, applicationName);

  return await doDeleteRequest(
    `${getBaseUrl()}${url}`,
    {
      where,
    },
    true
  );
}



/*
interface UploadedFileType {
  tbU: string;
  name: string;
  id: string;
  type: string;
}

interface UploadImagesType {
  e: any;
  t_s_4_6_3_t: string;
  clientUserName: string;
  v_3_5_6: string;
  imagekit: any;
  setLoading?: (status: boolean) => void;
  // to return the ids of uploaded files
  setUploadedFiles?: (data: UploadedFileType[]) => void;
  uFiles?: UploadImagesType[];
}*/

export function isExternalLink(url: string) {
  if (url) {
    const $url = url.toLowerCase();
    return (
      $url.includes("http://") ||
      $url.includes("https://") ||
      $url.includes("mailto:")
    );
  }
  return false;
}

export function validateEmail(/**email: string */) {
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return re.test(String(email).toLowerCase());
  return true;
}

// Loggin
export const Logger = {
  log: (name: string, message?: any) => {
    console.log(name, message);
  },
};

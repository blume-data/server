import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {RouteAddressStateType} from "../../../rootReducer";

export const ACTION_FETCH_AUTH_ADDRESS_ROUTES = 'ACTION_FETCH_i-love-ran-jo-dh-ADDRESS_ROUTES';
export const ACTION_FETCH_DATA_ADDRESS_ROUTES = 'ACTION_FETCH_DATA_ADDRESS_ROUTES';
export const ACTION_FETCH_ASSETS_ADDRESS_ROUTES = 'ACTION_FETCH_ASSETS_ADDRESS_ROUTES';
export const ACTION_FETCH_APPLICATION_NAMES = 'ACTION_FETCH_APPLICATION_NAMES';
export const ACTION_ADDRESS_ROUTES_LOADING = 'ACTION_ADDRESS_ROUTES_LOADING';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RouteAddressStateType,
    unknown,
    Action<string>
    >

export interface RouteActionType {
    auth?: AuthRoutesType;
    type?: string;
    loading?: boolean;
    data?: DataRoutesType;
    assets?: AssetsRoutesType;
}

export interface AssetsRoutesType {
    getSignedUrl: string;
    getAssets: string;
    authAssets: string;
    verifyTempRecord: string;
    createTempRecord: string;
    getAsset: string;
}


interface DataRoutesType {
    StoreUrl: string;
    CollectionUrl: string;
    ApplicationNameUrl: string;
    GetCollectionNamesUrl: string;
    GetDataModelUrl: string;
    GetEntriesUrl: string;
}

interface AuthRoutesType {
    authRootUrl: string;
    register: string;
    logOut: string;
    logIn: string;
    currentUser: string;
    emailVerification: string;
    userNameValidation: string;
    envUrl: string;
    userGroupUrl: string;
    otherUserUrl: string;
}

export interface RouteAddressesInitialStateType {
    routes: {
        auth: AuthRoutesType | null;
        loading: boolean;
        data: DataRoutesType | null;
        assets: AssetsRoutesType | null;
    }
}
import {NewsType} from "./interface";
import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {NewsStateType} from "../../../rootReducer";

export const ACTION_FETCH_ADDRESS_ROUTES = 'ACTION_FETCH_ADDRESS_ROUTES';
export const LOADING_ACTION_FETCH_NEWS = 'LOADING_ACTION_FETCH_NEWS';
export const SYNC_NEWS_CACHE_STORAGE = 'SYNC_NEWS_CACHE_STORAGE';
export const UPDATE_VOTE_ACTION = 'UPDATE_VOTE_ACTION';
export const TOGGLE_HIDE_NEWS_ACTION = 'TOGGLE_HIDE_NEWS_ACTION';
export const ERROR_NEWS_ACTION = 'ERROR_NEWS_ACTION';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    NewsStateType,
    unknown,
    Action<string>
    >

export interface AuthActionType {
    auth: AuthRoutesType;
    type: string;
}

export interface NewsInitialStateType {
    news: NewsType[],
    page: number,
    isLoading?: boolean,
    errors?: string | null
}

interface AuthRoutesType {
    authRootUrl: string;
    register: string;
    logOut: string;
    logIn: string;
    currentUser: string;
    emailVerification: string;
    userNameValidation: string;
}

export interface RouteAddressesInitialStateType {
    routes: {
        auth: AuthRoutesType | null
    }
}
import {NewsType} from "./interface";
import {ThunkAction} from "redux-thunk";
import {NewsStateType} from "../../rootReducer";
import {Action} from "redux";

export const ACTION_FETCH_NEWS = 'ACTION_FETCH_NEWS';
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

export interface NewsActionType {
    type: string,
    news: NewsType[],
    page: number,
    isLoading: boolean,
    objectId: string
    message: string
}

export interface NewsInitialStateType {
    news: NewsType[],
    page: number,
    isLoading?: boolean,
    errors?: string | null
}
import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {AuthenticationStateType} from "../../../../rootReducer";

export const ACTION_AUTHENTICATE = 'ACTION_AUTHENTICATE';
export const ACTION_SET_ENV = 'ACTION_SET_ENV';
export const ACTION_SET_LANGUAGE = 'ACTION_SET_LANGUAGE';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AuthenticationStateType,
    unknown,
    Action<string>
    >

export interface AuthActionType {
    payload: boolean;
    type: string;
    env?: string;
    language?: string;
}

export interface AuthenticationInitialStateType {
    isAuth: boolean;
    env: string;
    language: string;
}
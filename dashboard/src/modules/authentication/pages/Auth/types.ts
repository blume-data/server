import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {AuthenticationStateType} from "../../../../rootReducer";

export const ACTION_AUTHENTICATE = 'ACTION_AUTHENTICATE';
export const ACTION_SET_ENV = 'ACTION_SET_ENV';
export const ACTION_SET_LANGUAGE = 'ACTION_SET_LANGUAGE';
export const ACTION_SET_APPLICATION_NAME = 'ACTION_SET_APPLICATION_NAME';

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
    applicationName?: string;
    data: any;
}

interface ApplicationNamesRedux {
    name: string;
    env: string[];
}
export interface AuthenticationInitialStateType {
    isAuth: boolean;
    env: string;
    language: string;
    applicationName: string;
    applicationsNames: ApplicationNamesRedux[];
}
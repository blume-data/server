import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {AuthenticationStateType} from "../../../../rootReducer";

export const ACTION_AUTHENTICATE = 'ACTION_AUTHENTICATE';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AuthenticationStateType,
    unknown,
    Action<string>
    >

export interface AuthActionType {
    payload: boolean;
    type: string;
}

export interface AuthenticationInitialStateType {
    isAuth: Boolean
}
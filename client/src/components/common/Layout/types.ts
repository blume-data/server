import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {RouteAddressStateType} from "../../../rootReducer";

export const ACTION_FETCH_ADDRESS_ROUTES = 'ACTION_FETCH_ADDRESS_ROUTES';
export const ACTION_ADDRESS_ROUTES_LOADING = 'ACTION_ADDRESS_ROUTES_LOADING';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RouteAddressStateType,
    unknown,
    Action<string>
    >

export interface AuthActionType {
    auth: AuthRoutesType;
    type?: string;
    loading?: boolean;
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
        auth: AuthRoutesType | null,
        loading: boolean
    }
}
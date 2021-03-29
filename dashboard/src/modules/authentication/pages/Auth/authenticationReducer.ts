import {
    AuthenticationInitialStateType,
    AuthActionType,
    ACTION_AUTHENTICATE, ACTION_SET_ENV, ACTION_SET_LANGUAGE, ACTION_SET_APPLICATION_NAME
} from './types'
import {EnglishLanguage, PRODUCTION_ENV} from "@ranjodhbirkaur/constants";
import {
    LOCAL_STORAGE_ENV,
    LOCAL_STORAGE_LANGUAGE,
    LOCAL_STORAGE_SELECTED_APPLICATION_NAME
} from "../../../../utils/constants";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {ACTION_FETCH_APPLICATION_NAMES} from "../../../../components/common/Layout/types";

const selectedApplicationName = getItemFromLocalStorage(LOCAL_STORAGE_SELECTED_APPLICATION_NAME);

const initialState: AuthenticationInitialStateType = {
    isAuth: false,
    env: PRODUCTION_ENV,
    language: EnglishLanguage,
    applicationName: selectedApplicationName ? selectedApplicationName : '',
    applicationsNames: []
};

export function authenticationReducer(
    state = initialState,
    action: AuthActionType
): AuthenticationInitialStateType {

    switch (action.type) {

        case ACTION_AUTHENTICATE: {
            return {
                ...state,
                isAuth: action.payload
            }
        }
        case ACTION_SET_ENV: {
            const env = action.env ? action.env : PRODUCTION_ENV;
            localStorage.setItem(LOCAL_STORAGE_ENV, env);
            return {
                ...state,
                env
            }
        }
        case ACTION_SET_LANGUAGE: {

            const language = action.language ? action.language : EnglishLanguage;
            localStorage.setItem(LOCAL_STORAGE_LANGUAGE, language);
            return {
                ...state,
                language
            }
        }
        case ACTION_SET_APPLICATION_NAME: {

            const applicationName = action.applicationName ? action.applicationName : '';
            if(applicationName || applicationName === '') {
                localStorage.setItem(LOCAL_STORAGE_SELECTED_APPLICATION_NAME, applicationName);
            }
            return {
                ...state,
                applicationName: action.applicationName ? action.applicationName : ''
            }
        }
        case ACTION_FETCH_APPLICATION_NAMES: {
            return {
                ...state,
                applicationsNames: action.data.applicationNames
            }
        }

        default:
            return state
    }
}
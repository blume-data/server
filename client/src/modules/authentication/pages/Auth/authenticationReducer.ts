import {
    AuthenticationInitialStateType,
    AuthActionType,
    ACTION_AUTHENTICATE, ACTION_SET_ENV, ACTION_SET_LANGUAGE
} from './types'
import {DEVELOPMENT_ENV, EnglishLanguage, PRODUCTION_ENV} from "@ranjodhbirkaur/constants";
import {LOCAL_STORAGE_ENV, LOCAL_STORAGE_LANGUAGE} from "../../../../utils/constants";

const initialState: AuthenticationInitialStateType = {
    isAuth: false,
    env: PRODUCTION_ENV,
    language: EnglishLanguage
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

        default:
            return state
    }
}
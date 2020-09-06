import {
    AuthenticationInitialStateType,
    AuthActionType,
    ACTION_AUTHENTICATE
} from './types'

const initialState: AuthenticationInitialStateType = {
    isAuth: false
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

        default:
            return state
    }
}
import {
    RouteAddressesInitialStateType,
    AuthActionType,
    ACTION_FETCH_ADDRESS_ROUTES
} from './types'

const initialState: RouteAddressesInitialStateType = {
    routes: {
        auth: null
    }
};

export function routeAddressReducer(
    state = initialState,
    action: AuthActionType
): RouteAddressesInitialStateType {

    switch (action.type) {

        case ACTION_FETCH_ADDRESS_ROUTES: {
            return {
                ...state,
                routes: {
                    auth: action.auth
                }
            }
        }
        default:
            return state
    }
}
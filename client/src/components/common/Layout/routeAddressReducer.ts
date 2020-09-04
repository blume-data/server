import {
    RouteAddressesInitialStateType,
    AuthActionType,
    ACTION_FETCH_ADDRESS_ROUTES, ACTION_ADDRESS_ROUTES_LOADING
} from './types'

const initialState: RouteAddressesInitialStateType = {
    routes: {
        auth: null,
        loading: false
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
                    ...state.routes,
                    auth: action.auth ? action.auth : null
                }
            }
        }

        case ACTION_ADDRESS_ROUTES_LOADING: {
            return {
                ...state,
                routes: {
                    ...state.routes,
                    loading: action.loading ? action.loading : false
                }
            }
        }

        default:
            return state
    }
}
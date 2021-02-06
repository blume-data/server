import {
    RouteAddressesInitialStateType,
    RouteActionType, ACTION_ADDRESS_ROUTES_LOADING, ACTION_FETCH_DATA_ADDRESS_ROUTES,
    ACTION_FETCH_AUTH_ADDRESS_ROUTES, ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
} from './types'

const initialState: RouteAddressesInitialStateType = {
    routes: {
        data: null,
        auth: null,
        loading: false,
        assets: null
    }
};

export function routeAddressReducer(
    state = initialState,
    action: RouteActionType
): RouteAddressesInitialStateType {

    switch (action.type) {

        case ACTION_FETCH_AUTH_ADDRESS_ROUTES: {
            return {
                ...state,
                routes: {
                    ...state.routes,
                    auth: action.auth ? action.auth : null
                }
            }
        }

        case ACTION_FETCH_DATA_ADDRESS_ROUTES: {
            return {
                ...state,
                routes: {
                    ...state.routes,
                    data: action.data ? action.data : null
                }
            }
        }

        case ACTION_FETCH_ASSETS_ADDRESS_ROUTES: {
            return {
                ...state,
                routes: {
                    ...state.routes,
                    assets: action.assets ? action.assets : null
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
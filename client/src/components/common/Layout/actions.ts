import {AnyAction, Dispatch} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {ACTION_FETCH_AUTH_ADDRESS_ROUTES, AppThunk, ACTION_ADDRESS_ROUTES_LOADING} from "./types";
import {doGetRequest} from "../../../utils/baseApi";
import {getAuthRoutes} from "../../../utils/urls";

function setLoading(status: boolean, dispatch: Dispatch) {
    dispatch({
        type: ACTION_ADDRESS_ROUTES_LOADING,
        isLoading: status
    });
}

export const fetchAuthRouteAddresses = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    setLoading(true, dispatch);
    const response = await doGetRequest(getAuthRoutes(), {userType: 'clientUserType'}, false);
    if (response && response.auth) {
        dispatch({
            type: ACTION_FETCH_AUTH_ADDRESS_ROUTES,
            auth: response.auth
        });
    }
};
import {AnyAction, Dispatch} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {ACTION_FETCH_ADDRESS_ROUTES, AppThunk, LOADING_ACTION_FETCH_NEWS} from "./types";
import {doGetRequest} from "../../../utils/baseApi";
import {getRouteAddressesUrl} from "../../../utils/urls";

function setLoading(status: boolean, dispatch: Dispatch) {
    dispatch({
        type: LOADING_ACTION_FETCH_NEWS,
        isLoading: status
    });
}

export const fetchRouteAddresses = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    setLoading(true, dispatch);
    const response = await doGetRequest(getRouteAddressesUrl(), {userType: 'clientUserType'}, false);
    dispatch({
        type: ACTION_FETCH_ADDRESS_ROUTES,
        auth: response.auth
    });
};
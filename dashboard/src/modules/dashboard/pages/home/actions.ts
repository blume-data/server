import {AnyAction, Dispatch} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {
    ACTION_ADDRESS_ROUTES_LOADING, ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
    ACTION_FETCH_DATA_ADDRESS_ROUTES, AppThunk
} from "../../../../components/common/Layout/types";
import {doGetRequest} from "../../../../utils/baseApi";
import {getDataRoutes, getAssetsRoutes} from "../../../../utils/urls";

function setLoading(status: boolean, dispatch: Dispatch) {
    dispatch({
        type: ACTION_ADDRESS_ROUTES_LOADING,
        isLoading: status
    });
}

export const fetchAssetsRouteAddress = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    const response = await doGetRequest(getAssetsRoutes(), {}, false);
    console.log('res', response);
    if (response && !response.errors) {
        dispatch({
            type: ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
            assets: response
        });
    }
}

export const fetchDataRouteAddresses = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    setLoading(true, dispatch);
    const response = await doGetRequest(getDataRoutes(), {userType: 'clientUserType'}, false);
    if (response && !response.errors) {
        dispatch({
            type: ACTION_FETCH_DATA_ADDRESS_ROUTES,
            data: response
        });
    }
};

export const setConfigration = (field: string): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {

};
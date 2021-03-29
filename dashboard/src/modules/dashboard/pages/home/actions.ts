import {AnyAction} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {
    ACTION_FETCH_APPLICATION_NAMES,
    ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
    ACTION_FETCH_DATA_ADDRESS_ROUTES, AppThunk
} from "../../../../components/common/Layout/types";
import { ASSETS_ROUTE, DATA_ROUTES } from '../../../../utils/constants';
import {doGetRequest} from "../../../../utils/baseApi";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getBaseUrl} from "../../../../utils/urls";

export const fetchAssetsRouteAddress = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
        type: ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
        assets: ASSETS_ROUTE
    });
}

export const fetchDataRouteAddresses = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
        type: ACTION_FETCH_DATA_ADDRESS_ROUTES,
        data: DATA_ROUTES
    });
};

export const fetchApplicationNames = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: any) => {

    const state = getState();
    if(state && state.routeAddress) {
        const ApplicationNameUrl = state.routeAddress.routes.data?.ApplicationNameUrl;
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        const url = ApplicationNameUrl
            .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
            .replace(`:${APPLICATION_NAME}?`,'');

        const response = await doGetRequest(`${getBaseUrl()}${url}`, null,true);
        console.log('Respnse', response);

        dispatch({
            type: ACTION_FETCH_APPLICATION_NAMES,
            data: response
        })
    }
}

import {AnyAction} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {
    ACTION_FETCH_ASSETS_ADDRESS_ROUTES,
    ACTION_FETCH_DATA_ADDRESS_ROUTES, AppThunk
} from "../../../../components/common/Layout/types";
import { ASSETS_ROUTE, DATA_ROUTES } from '../../../../utils/constants';

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

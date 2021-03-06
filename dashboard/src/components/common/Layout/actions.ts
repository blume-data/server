import {AnyAction} from 'redux'
import {ThunkDispatch} from "redux-thunk";
import {ACTION_FETCH_AUTH_ADDRESS_ROUTES, AppThunk} from "./types";
import { AUTH_ROUTES } from '../../../utils/constants';

export const fetchAuthRouteAddresses = (): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  dispatch({
      type: ACTION_FETCH_AUTH_ADDRESS_ROUTES,
      auth: AUTH_ROUTES
  });
};

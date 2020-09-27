import {AnyAction} from "redux";
import {
    ACTION_AUTHENTICATE,
    AppThunk
} from "./types";
import {ThunkDispatch} from "redux-thunk";

export const setAuthentication = (status: boolean): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    dispatch({
        type: ACTION_AUTHENTICATE,
        payload: status
    });
};
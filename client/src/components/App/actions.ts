import {AnyAction, Dispatch} from 'redux'
import {getData} from "../../utils/httpRequests";
import {getNewsUrl, getRouteAddressesUrl} from "../../utils/urls";
import {cleanNewsData} from "../../utils/tools";
import {
    ACTION_FETCH_NEWS, AppThunk, ERROR_NEWS_ACTION,
    LOADING_ACTION_FETCH_NEWS,
    SYNC_NEWS_CACHE_STORAGE,
    TOGGLE_HIDE_NEWS_ACTION,
    UPDATE_VOTE_ACTION
} from "./types";
import {ThunkDispatch} from "redux-thunk";
import {doGetRequest} from "../../utils/baseApi";

function setLoading(status: boolean, dispatch: Dispatch) {
    dispatch({
        type: LOADING_ACTION_FETCH_NEWS,
        isLoading: status
    });
}

export const fetchNewsData = (page=1): AppThunk => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {

    setLoading(true, dispatch);
    const response = await getData(`${getNewsUrl}&page=${page}`);

    if (response && response.hits) {
        const payload = cleanNewsData(response.hits);
        dispatch({
           type: ACTION_FETCH_NEWS,
           news: payload,
           page
        });
        setLoading(false, dispatch);
        try {
            if (localStorage) {
                // sync data
                dispatch({
                    type: SYNC_NEWS_CACHE_STORAGE
                });
            }
        }
        catch (e) {
            console.log('skipped cache sync in server');
        }
    }
    else {
        dispatch({
            type: ERROR_NEWS_ACTION,
            message: response
        });
        setTimeout(() => {
            dispatch({
                type: ERROR_NEWS_ACTION,
                message: null
            });
        }, 3000);
        setLoading(false, dispatch);
    }
    return response;
};

export const updateVote = (id: string): AppThunk => async dispatch => {

    dispatch({
        type: UPDATE_VOTE_ACTION,
        objectId: id,
    });
};

export const toggleHide = (id: string): AppThunk => async dispatch => {
    dispatch({
        type: TOGGLE_HIDE_NEWS_ACTION,
        objectId: id,
    });
};

export const syncData = (): AppThunk => async dispatch => {
    dispatch({
        type: SYNC_NEWS_CACHE_STORAGE
    });
};
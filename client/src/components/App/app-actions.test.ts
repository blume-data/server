import configureStore from 'redux-mock-store';
import thunk  from 'redux-thunk';
import * as actions from './actions';
import {getNewsUrl} from "../../utils/urls";
import {
    ACTION_FETCH_NEWS, ERROR_NEWS_ACTION,
    LOADING_ACTION_FETCH_NEWS,
    SYNC_NEWS_CACHE_STORAGE,
    TOGGLE_HIDE_NEWS_ACTION,
    UPDATE_VOTE_ACTION
} from "./types";
import {getData} from "../../utils/httpRequests";
import {cleanNewsData} from "../../utils/tools";

const initialState = {};
type State = typeof initialState;
const middlewares = [thunk];
const mockStore = configureStore<State, any>(middlewares);
const store = mockStore(initialState);

describe('action creators', () => {
    describe('#fetch news data, # votes is incremented', () => {
        afterEach(() => {
            store.clearActions();
        });
        it('load news', async () => {
            const page = 1;
            await store.dispatch(actions.fetchNewsData(page));
            const response = await getData(`${getNewsUrl}&page=${page}`);
            const payload = cleanNewsData(response.hits);
            expect(store.getActions()).toEqual([
                { type: 'LOADING_ACTION_FETCH_NEWS', isLoading: true },
                { type: ACTION_FETCH_NEWS, news: payload, page },
                { type: LOADING_ACTION_FETCH_NEWS, isLoading: false },
                { type: SYNC_NEWS_CACHE_STORAGE }
            ]);
        });

        it('vote is incremented', async () => {
            const id = '23432';
            await store.dispatch(actions.updateVote(id));
            expect(store.getActions()).toEqual([
                { type: UPDATE_VOTE_ACTION, objectId: id }
            ]);
        });

        it('toggle the hide', async () => {
            const id = 'dsfsdfds';
            await store.dispatch(actions.toggleHide(id));
            expect(store.getActions()).toEqual([
                { type: TOGGLE_HIDE_NEWS_ACTION, objectId: id }
            ]);
        });

        it('syncData', async () => {
            await store.dispatch(actions.syncData());
            expect(store.getActions()).toEqual([
                { type: SYNC_NEWS_CACHE_STORAGE }
            ]);
        });

        it('captures error', async () => {
            // @ts-ignore
            await store.dispatch(actions.fetchNewsData('sdfsfssdsdfs'));
            expect(store.getActions()).toEqual([
                { type: 'LOADING_ACTION_FETCH_NEWS', isLoading: true },
                { type: ERROR_NEWS_ACTION, message: 'Network Error' },
                { type: 'LOADING_ACTION_FETCH_NEWS', isLoading: false },
            ]);
        });
    });
});
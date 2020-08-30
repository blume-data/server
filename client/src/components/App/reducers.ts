import {
    NewsInitialStateType,
    NewsActionType,
    ACTION_FETCH_NEWS,
    LOADING_ACTION_FETCH_NEWS,
    SYNC_NEWS_CACHE_STORAGE, UPDATE_VOTE_ACTION, TOGGLE_HIDE_NEWS_ACTION, ERROR_NEWS_ACTION
} from './types'
import {SyncCacheStorage, CacheStorage} from "../../utils/CaheStorage";

const initialState: NewsInitialStateType = {
    news: [],
    page: 1,
    isLoading: false,
    errors: null
};

export function newsReducer(
    state = initialState,
    action: NewsActionType
): NewsInitialStateType {

    function updateNews(objectId: string, actionType: 'set-vote' | 'set-hide') {
        const index = state.news.findIndex(newsItem => newsItem.objectID === objectId);
        const newsItem = state.news.find(newsItem => newsItem.objectID === objectId);

        if (index !== -1 && newsItem) {
            const cacheData = new CacheStorage(objectId, newsItem.isHidden, newsItem.points);
            if (actionType === 'set-vote') {
                cacheData.updateVotes();
            }
            else if(actionType === 'set-hide') {
                cacheData.setHidden();
            }
            const newsData = JSON.parse(JSON.stringify(state.news));
            newsData[index] = {
                ...newsData[index],
                points: actionType === 'set-vote' ? newsData[index].points+1 : newsData[index].points,
                isHidden: actionType === 'set-hide' ? !newsData[index].isHidden : newsData[index].isHidden
            };
            return {
                ...state,
                news: newsData
            };
        }
        return state;
    }
    switch (action.type) {
        case ACTION_FETCH_NEWS: {
            return {
                ...state,
                news: action.news,
                page: action.page,
            }
        }

        case SYNC_NEWS_CACHE_STORAGE: {
            const syncedData = new SyncCacheStorage(state.news).syncCache();
            return {
                ...state,
                news: syncedData,
            }
        }

        case LOADING_ACTION_FETCH_NEWS: {
            return {
                ...state,
                isLoading: action.isLoading
            }
        }

        case UPDATE_VOTE_ACTION: {
            return updateNews(action.objectId, 'set-vote');
        }
        case TOGGLE_HIDE_NEWS_ACTION: {
            return updateNews(action.objectId, 'set-hide');
        }

        case ERROR_NEWS_ACTION: {
            return {
                ...state,
                errors: action.message
            }
        }
        default:
            return state
    }
}
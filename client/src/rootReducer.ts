import { newsReducer } from './components/App/reducers';
import {combineReducers} from "redux";

export const rootReducer = combineReducers({
    newsData: newsReducer
});

export type NewsStateType = ReturnType<typeof newsReducer>;
export type RootState = ReturnType<typeof rootReducer>
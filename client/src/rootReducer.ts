import { newsReducer } from './components/App/reducers';
import {combineReducers} from "redux";
import {routeAddressReducer} from "./components/common/Layout/routeAddressReducer";

export const rootReducer = combineReducers({
    newsData: newsReducer,
    routeAddress: routeAddressReducer
});

export type NewsStateType = ReturnType<typeof newsReducer>;
export type RouteAddressStateType = ReturnType<typeof routeAddressReducer>;
export type RootState = ReturnType<typeof rootReducer>
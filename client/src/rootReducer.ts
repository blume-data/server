import {combineReducers} from "redux";
import {routeAddressReducer} from "./components/common/Layout/routeAddressReducer";

export const rootReducer = combineReducers({
    routeAddress: routeAddressReducer
});

export type RouteAddressStateType = ReturnType<typeof routeAddressReducer>;
export type RootState = ReturnType<typeof rootReducer>
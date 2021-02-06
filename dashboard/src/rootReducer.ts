import {combineReducers} from "redux";
import {routeAddressReducer} from "./components/common/Layout/routeAddressReducer";
import {authenticationReducer} from "./modules/authentication/pages/Auth/authenticationReducer";

export const rootReducer = combineReducers({
    routeAddress: routeAddressReducer,
    authentication: authenticationReducer,
});

export type RouteAddressStateType = ReturnType<typeof routeAddressReducer>;
export type AuthenticationStateType = ReturnType<typeof authenticationReducer>;
export type RootState = ReturnType<typeof rootReducer>
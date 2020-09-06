import React from "react";
import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth, AUTH_ROOT, SIGN_IN} from "./modules/authentication/pages/Auth";
import {Home} from "./modules/dashboard/pages/home";
import {Redirect} from "react-router-dom";
import {checkAuthentication} from "./modules/authentication/pages/Auth/methods";

function PrivateRoute(component: () => JSX.Element) {
    const isAuth = checkAuthentication();
    if (!isAuth) {
        return () => <Redirect to={`/${AUTH_ROOT}/${SIGN_IN}`} />
    }
    return component;
}

export const Routes = [
    {
        path: '/',
        component: App,
        exact: true
    },
    {
        path: '/auth/:step',
        component: Auth,
        exact: true
    },
    {
        path: '/dashboard/home',
        component: PrivateRoute(Home),
        exact: true
    },
    {
        path: '*',
        component: RouteNotFound,
        exact: true
    },
];
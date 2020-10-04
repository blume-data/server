import React from "react";
import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth, AUTH_ROOT, SIGN_IN} from "./modules/authentication/pages/Auth";
import Home from "./modules/dashboard/pages/home";
import {Redirect} from "react-router-dom";
import {checkAuthentication} from "./modules/authentication/pages/Auth/methods";
import {authUrl, dashboardApplicationNamesUrl, dashboardHomeUrl} from "./utils/urls";
import {ApplicationNames} from "./modules/dashboard/pages/applicationNames";

function PrivateRoute(Component: any) {
    return () => {
        const isAuth = checkAuthentication();
        if (!isAuth) {
            return <Redirect to={`/${AUTH_ROOT}/${SIGN_IN}`} />
        }
        return <Component />
    }
}

export const Routes = [
    {
        path: '/',
        component: App,
        exact: true
    },
    {
        path: `${authUrl}/:step`,
        component: Auth,
        exact: true
    },
    {
        path: dashboardHomeUrl,
        render: PrivateRoute(Home),
        exact: true
    },
    {
        path: dashboardApplicationNamesUrl,
        render: PrivateRoute(ApplicationNames),
        exact: true
    },
    {
        path: '*',
        component: RouteNotFound,
        exact: true
    },
];
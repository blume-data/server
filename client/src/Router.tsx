import React from "react";
import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth, AUTH_ROOT, SIGN_IN} from "./modules/authentication/pages/Auth";
import Home from "./modules/dashboard/pages/home";
import {Redirect} from "react-router-dom";
import {checkAuthentication} from "./modules/authentication/pages/Auth/methods";
import {
    authUrl,
    dashboardApplicationNamesUrl,
    dashboardApplicationNameUrl,
    dashboardHomeUrl,
    dashboardDataModelsUrl,
    dashboardDataEntriesUrl,
    dashboardCreateDataEntryUrl,
    dashboardCreateDataModelsUrl,
    assetsUrl
} from "./utils/urls";
import ApplicationNames from "./modules/dashboard/pages/applicationNames";
import ApplicationName from "./modules/dashboard/pages/ApplicationName";
import DataModels from "./modules/dashboard/pages/ApplicationName/DataModels";
import {DataEntries} from "./modules/dashboard/pages/DateEntries";
import CreateEntry from "./modules/dashboard/pages/DateEntries/CreateEntry";
import CreateDataModel from "./modules/dashboard/pages/ApplicationName/DataModels/CreateDataModel";
import {Assets} from "./modules/assets";

function PrivateRoute(Component: any) {
    return () => {
        const isAuth = checkAuthentication();
        if (!isAuth) {
            document.location.href=`../${AUTH_ROOT}/${SIGN_IN}`;
        }
        return <Component />
    }
}

export const Routes = [
    {path: '/', component: App, exact: true, loadData: (store: any) => {}},
    {path: `${authUrl}/:step`, component: Auth, exact: true},
    {path: dashboardHomeUrl, render: PrivateRoute(Home), exact: true},

    {path: dashboardApplicationNamesUrl, render: PrivateRoute(ApplicationNames), exact: true},
    {path: dashboardApplicationNameUrl, render: PrivateRoute(ApplicationName), exact: true},

    {path: dashboardDataModelsUrl, render: PrivateRoute(DataModels), exact: true},
    {path: dashboardCreateDataModelsUrl, render: PrivateRoute(CreateDataModel), exact: true},

    {path: dashboardDataEntriesUrl, render: PrivateRoute(DataEntries), exact: true},
    {path: dashboardCreateDataEntryUrl, render: PrivateRoute(CreateEntry), exact: true},

    {path: assetsUrl, render: PrivateRoute(Assets), exact: true},


    {path: '*', component: RouteNotFound, exact: true},
];
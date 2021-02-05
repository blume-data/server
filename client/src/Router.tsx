import React from "react";
import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth, AUTH_ROOT, SIGN_IN} from "./modules/authentication/pages/Auth";
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

const CreateDataModel = loadable(() => import('./modules/dashboard/pages/ApplicationName/DataModels/CreateDataModel'));
const CreateEntry = loadable(() => import('./modules/dashboard/pages/DateEntries/CreateEntry'));
const DataModels = loadable(() => import('./modules/dashboard/pages/ApplicationName/DataModels'));
const ApplicationName = loadable(() => import('./modules/dashboard/pages/ApplicationName'));
const ApplicationNames = loadable(() => import('./modules/dashboard/pages/applicationNames'));
const Home = loadable(() => import('./modules/dashboard/pages/home'));
const DataEntries = loadable(() => import('./modules/dashboard/pages/DateEntries'), {
    resolveComponent: component => component.DataEntries,
});

import {Assets} from "./modules/assets";
import loadable from "@loadable/component";

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
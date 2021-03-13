import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth, AUTH_ROOT, SIGN_IN} from "./modules/authentication/pages/Auth";
import {Redirect} from "react-router-dom";
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
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
    assetsUrl, APP_ROOT_URL
} from "./utils/urls";
import {Assets} from "./modules/assets";
import Layout from "./components/common/Layout";
import Home from "./modules/dashboard/pages/home";

import CreateDataModel from "./modules/dashboard/pages/ApplicationName/DataModels/CreateDataModel";
import CreateEntry from "./modules/dashboard/pages/DateEntries/CreateEntry";
import DataModels from "./modules/dashboard/pages/ApplicationName/DataModels";
import ApplicationName from "./modules/dashboard/pages/ApplicationName";
import ApplicationNames from "./modules/dashboard/pages/applicationNames";
import {DataEntries} from './modules/dashboard/pages/DateEntries';
import React from "react";

function PrivateRoute(Component: any) {
    return () => {
        const isAuth = checkAuthentication();
        if (!isAuth) {

            return <Redirect to={`${AUTH_ROOT}/${SIGN_IN}`} />
        }
        return <Component />
    }
}

export const RouterComponent = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path={APP_ROOT_URL} component={App} />
                    <Route exact path={`${authUrl}/:step`} component={Auth} />
                    {/*Private Routes*/}
                    <Route exact path={dashboardHomeUrl} component={PrivateRoute(Home)}/>
                    <Route exact path={dashboardApplicationNamesUrl} component={PrivateRoute(ApplicationNames)}/>
                    <Route exact path={dashboardApplicationNameUrl} component={PrivateRoute(ApplicationName)}/>

                    <Route exact path={dashboardDataModelsUrl} component={PrivateRoute(DataModels)}/>
                    <Route exact path={dashboardCreateDataModelsUrl} component={PrivateRoute(CreateDataModel)}/>

                    <Route exact path={dashboardDataEntriesUrl} component={PrivateRoute(DataEntries)}/>
                    <Route exact path={dashboardCreateDataEntryUrl} component={PrivateRoute(CreateEntry)}/>

                    <Route exact path={assetsUrl} component={PrivateRoute(Assets)}/>

                    <Route path={'*'} component={RouteNotFound}/>
                </Switch>

            </Layout>

        </Router>
    );
}
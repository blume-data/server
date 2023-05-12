import { lazy, Suspense } from "react";
import RouteNotFound from "./components/RouteNotFound";
import { Auth, AUTH_ROOT, SIGN_IN } from "./modules/authentication/pages/Auth";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { checkAuthentication } from "./modules/authentication/pages/Auth/methods";
import {
  authUrl,
  dashboardApplicationNamesUrl,
  dashboardApplicationNameUrl,
  dashboardHomeUrl,
  dashboardDataModelsUrl,
  dashboardDataEntriesUrl,
  dashboardCreateDataEntryUrl,
  dashboardCreateDataModelsUrl,
  assetsUrl,
  APP_ROOT_URL,
  dashboardEnvUrl,
  dashbaordUserUrl,
} from "./utils/urls";
import Layout from "./components/common/Layout";
import App from "./components/App";

const Assets = lazy(() =>
  import("./modules/assets").then((module) => ({ default: module.Assets }))
);
const DataEntries = lazy(() =>
  import("./modules/dashboard/pages/DateEntries").then((module) => ({
    default: module.DataEntries,
  }))
);
const Users = lazy(() =>
  import("./modules/dashboard/pages/Users").then((module) => ({
    default: module.Users,
  }))
);
const Envs = lazy(() => import("./modules/dashboard/pages/Envs"));
const ApplicationNames = lazy(
  () => import("./modules/dashboard/pages/applicationNames")
);
const ApplicationName = lazy(
  () => import("./modules/dashboard/pages/ApplicationName")
);
const DataModels = lazy(
  () => import("./modules/dashboard/pages/ApplicationName/DataModels")
);
const Home = lazy(() => import("./modules/dashboard/pages/home"));
const CreateEntry = lazy(
  () => import("./modules/dashboard/pages/DateEntries/CreateEntry")
);
const CreateDataModel = lazy(
  () =>
    import(
      "./modules/dashboard/pages/ApplicationName/DataModels/CreateDataModel"
    )
);

function suspenceComponent(Component: any) {
  return () => {
    return (
      <Suspense fallback="">
        <Component />
      </Suspense>
    );
  };
}

function PrivateRoute(Component: any) {
  return () => {
    const isAuth = checkAuthentication();
    if (!isAuth) {
      return <Redirect to={`${AUTH_ROOT}/${SIGN_IN}`} />;
    }
    return (
      <Suspense fallback="">
        <Component />
      </Suspense>
    );
  };
}

export const RouterComponent = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path={APP_ROOT_URL} component={App} />
          <Route
            exact
            path={`${authUrl}/:step`}
            component={suspenceComponent(Auth)}
          />

          <Route exact path={dashboardHomeUrl} component={PrivateRoute(Home)} />
          <Route
            exact
            path={dashboardApplicationNamesUrl}
            component={PrivateRoute(ApplicationNames)}
          />
          <Route
            exact
            path={dashboardApplicationNameUrl}
            component={PrivateRoute(ApplicationName)}
          />

          <Route exact path={dashboardEnvUrl} component={PrivateRoute(Envs)} />

          <Route
            exact
            path={dashbaordUserUrl}
            component={PrivateRoute(Users)}
          />

          <Route
            exact
            path={dashboardDataModelsUrl}
            component={PrivateRoute(DataModels)}
          />
          <Route
            exact
            path={dashboardCreateDataModelsUrl}
            component={PrivateRoute(CreateDataModel)}
          />

          <Route
            exact
            path={dashboardDataEntriesUrl}
            component={PrivateRoute(DataEntries)}
          />
          <Route
            exact
            path={dashboardCreateDataEntryUrl}
            component={PrivateRoute(CreateEntry)}
          />

          <Route exact path={assetsUrl} component={PrivateRoute(Assets)} />

          <Route path={"*"} component={RouteNotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

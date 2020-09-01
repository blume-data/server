import App, {loadAppData} from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth} from "./modules/authentication/pages/Auth";

export const Routes = [
    {
        path: '/',
        component: App,
        exact: true,
        loadData: loadAppData
    },
    {
        path: '/auth',
        component: Auth,
        exact: true
    },
    {
        path: '*',
        component: RouteNotFound,
        exact: true
    },
];
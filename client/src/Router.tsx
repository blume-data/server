import App from "./components/App";
import RouteNotFound from "./components/RouteNotFound";
import {Auth} from "./modules/authentication/pages/Auth";

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
        path: '*',
        component: RouteNotFound,
        exact: true
    },
];
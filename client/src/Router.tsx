import App, {loadAppData} from "./components/App";
import RouteNotFound from "./components/RouteNotFound";

export const Routes = [
    {
        path: '/',
        component: App,
        exact: true,
        loadData: loadAppData
    },
    {
        path: '*',
        component: RouteNotFound,
        exact: true
    }
];
import React from 'react';
import {hydrate} from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {renderRoutes} from "react-router-config";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import Layout from './components/common/Layout';
import {Routes} from './Router';
import {rootReducer, RouteAddressStateType} from './rootReducer';
import {Provider} from "react-redux";

declare global {
    interface Window {
        INITIAL_STATE: {
            routeAddress: RouteAddressStateType
        };
    }
}
let routeAddress: RouteAddressStateType;

if (window.INITIAL_STATE && window.INITIAL_STATE.routeAddress) {
    routeAddress = window.INITIAL_STATE.routeAddress;
}

const store = createStore(
    rootReducer,
    window.INITIAL_STATE,
    applyMiddleware(thunk)
);

const root = document.getElementById('root');
hydrate(<React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <Layout>
                {renderRoutes(Routes)}
            </Layout>
        </BrowserRouter>
    </Provider>
</React.StrictMode>, root);

serviceWorker.register();

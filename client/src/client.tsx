import React from 'react';
import {hydrate} from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {renderRoutes} from "react-router-config";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import Layout from './components/common/Layout';
import {Routes} from './Router';
import {NewsDataType, NewsType} from "./components/App/interface";
import {rootReducer} from './rootReducer';
import {Provider} from "react-redux";

declare global {
    interface Window {
        INITIAL_STATE: {
            newsData: {
                news: NewsType[],
                page: number
            }
        };
    }
}
let newsData: NewsDataType;

if (window.INITIAL_STATE && window.INITIAL_STATE.newsData) {
    newsData = window.INITIAL_STATE.newsData;
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

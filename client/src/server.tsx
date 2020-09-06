import React from 'react';
import {Request, Response} from 'express';
import {renderToString} from 'react-dom/server';
import {ChunkExtractor} from "@loadable/server";
import serialize from 'serialize-javascript';
import Layout from './components/common/Layout';
import { StaticRouter } from 'react-router-dom';
import {matchRoutes, renderRoutes} from "react-router-config";
import {Routes} from "./Router";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {rootReducer} from "./rootReducer";
import thunk from "redux-thunk";

const serverMiddleware = (webExtractor: ChunkExtractor) => {

    return async (req: Request, res: Response) => {

        const store = createStore(rootReducer, {}, applyMiddleware(thunk));

        const promises = matchRoutes(Routes, req.path)
            .map(({ route }) => {
                if (route.path === '/') {
                    const pageNo = req.query.page || 1;
                    return route.loadData ? route.loadData(store, Number(pageNo)) : null;
                }
                return route.loadData ? route.loadData(store) : null;
            })
            .map(promise => {
                if (promise) {
                    return new Promise((resolve, reject) => {
                        promise.then(resolve).catch(resolve);
                    });
                }
            });

        Promise.all(promises).then(() => {
            const context = {};

            const content = renderToString(
                <React.StrictMode>
                    <Provider store={store}>
                        <StaticRouter location={req.path} context={context}>
                            <Layout>
                                {renderRoutes(Routes)}
                            </Layout>
                        </StaticRouter>
                    </Provider>
                </React.StrictMode>
            );
            const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" />
<link rel="shortcut icon" href="/favicon.ico" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta name="description" content="Author: Taranjeet Singh, Pwa-Hacker-News Coding Assignment " />
<link rel="manifest" href="/manifest.json" />
<title>React App</title>
${webExtractor.getLinkTags()}${webExtractor.getStyleTags()}
<link rel="apple-touch-icon" href="/logo192.png">
</head>
<body><noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root">${content}</div>
<script>window.INITIAL_STATE = ${serialize(store.getState())}</script>
${webExtractor.getScriptTags()}
</body>
</html>`;

            res.send(html);
        });
    }
};

export default serverMiddleware;
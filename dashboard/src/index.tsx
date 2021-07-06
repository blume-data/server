import {BrowserRouter} from "react-router-dom";
import {applyMiddleware, createStore, compose} from "redux";
import thunk from "redux-thunk";
import {RouterComponent} from './Router';
import {rootReducer, RouteAddressStateType} from './rootReducer';
import {Provider} from "react-redux";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import React from "react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import reportWebVitals from './reportWebVitals';


declare global {
    interface Window {
        INITIAL_STATE: {
            routeAddress: RouteAddressStateType
        };
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}
let routeAddress: RouteAddressStateType;

if (window.INITIAL_STATE && window.INITIAL_STATE.routeAddress) {
    routeAddress = window.INITIAL_STATE.routeAddress;
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer,
    window.INITIAL_STATE,
    composeEnhancers(applyMiddleware(thunk)),
);
/* eslint-enable */


const theme = createMuiTheme({
    palette: {
      primary: {
          main: '#3d44c3'
      },
      secondary: {
        main: '#f50057'
      },
      error: {
        main: '#f63e54',
      },
    }
  });


if(process.env.REACT_APP_ENV !== 'test') {
    Sentry.init({
        dsn: "https://9eaafcd0a5c94c6db6e86edf8e522e19@o912965.ingest.sentry.io/5850349",
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
    });
}


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <RouterComponent />
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();

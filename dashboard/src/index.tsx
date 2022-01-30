import {BrowserRouter} from "react-router-dom";
import {applyMiddleware, createStore, compose} from "redux";
import thunk from "redux-thunk";
import {RouterComponent} from './Router';
import {rootReducer, RouteAddressStateType} from './rootReducer';
import {Provider} from "react-redux";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import React from "react";
import reportWebVitals from './reportWebVitals';
import {Provider as StateProvider} from "@minimal_ui/save_data";
import { paletteColor } from "./utils/constants";
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
    palette: paletteColor
  });

ReactDOM.render(
    <React.StrictMode>
        <StateProvider>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <BrowserRouter>
                        <RouterComponent />
                    </BrowserRouter>
                </MuiThemeProvider>
            </Provider>
        </StateProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();
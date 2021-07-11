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
import {register} from './serviceWorker';
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
// turn on service worker
register();

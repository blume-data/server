import {BrowserRouter} from "react-router-dom";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {RouterComponent} from './Router';
import {rootReducer, RouteAddressStateType} from './rootReducer';
import {Provider} from "react-redux";
import ReactDOM from "react-dom";
import React from "react";
import reportWebVitals from './reportWebVitals';

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


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <RouterComponent />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();

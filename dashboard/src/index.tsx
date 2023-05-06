import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { RouterComponent } from "./Router";
import { rootReducer, RouteAddressStateType } from "./rootReducer";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { Profiler } from "react";
import reportWebVitals from "./reportWebVitals";
import { paletteColor } from "./utils/constants";
import "./index.scss";
declare global {
  interface Window {
    INITIAL_STATE: {
      routeAddress: RouteAddressStateType;
    };
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}
let routeAddress: RouteAddressStateType | null = null;

if (window.INITIAL_STATE && window.INITIAL_STATE.routeAddress) {
  routeAddress = window.INITIAL_STATE.routeAddress;
}

 
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  window.INITIAL_STATE,
  composeEnhancers(applyMiddleware(thunk))
);
/* eslint-enable */

const onRender = (id: any, phase:any, actualDuration:any, baseDuration:any, startTime:any, commitTime:any) => {
  // Aggregate or log render timings...
  const logs = {
    id, phase, actualDuration, baseDuration, startTime, commitTime
  };

  console.log("Log", logs);
}

const theme = createTheme({
  palette: paletteColor
});

ReactDOM.render(
  <React.StrictMode>
    <Profiler id="profiler-app" onRender={onRender}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <RouterComponent />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
      </Profiler>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();

import React, {useEffect} from 'react';
import './index.scss'
import Grid from "@material-ui/core/Grid";
import {Footer} from "../Footer";
import {NavBar} from "../NavBar";
import {connect, ConnectedProps} from "react-redux";

import {RootState} from "../../../rootReducer";
import {fetchAuthRouteAddresses} from "./actions";
import {checkAuthentication} from "../../../modules/authentication/pages/Auth/methods";
import {setAuthentication} from "../../../modules/authentication/pages/Auth/actions";
import {fetchDataRouteAddresses} from "../../../modules/dashboard/pages/home/actions";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AppProps = PropsFromRedux & {
    rootClass?: string;
    id?: string;
    children: JSX.Element;
}

const Layout = (props: AppProps) => {
    const {children, setAuthentication} = props;
    useEffect(() => {
        props.fetchAuthRouteAddresses();
        props.fetchDataRouteAddresses();
        const isAuthenticated = checkAuthentication();
        setAuthentication(isAuthenticated);
    }, []);

    return (
        <Grid className="appLayout">
            <NavBar />
            <Grid className="app-child-container">
                {children}
            </Grid>
            <Footer />
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    routeAddress: state.routeAddress
});

const connector = connect(mapState, {fetchAuthRouteAddresses, setAuthentication, fetchDataRouteAddresses});
export default connector(Layout);
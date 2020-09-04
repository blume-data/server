import React, {useEffect} from 'react';
import './index.scss'
import Grid from "@material-ui/core/Grid";
import {Footer} from "../Footer";
import {NavBar} from "../NavBar";
import {connect, ConnectedProps} from "react-redux";

import {RootState} from "../../../rootReducer";
import {fetchRouteAddresses} from "./actions";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AppProps = PropsFromRedux & {
    rootClass?: string;
    id?: string;
    children: JSX.Element;
}

const Layout = (props: AppProps) => {
    const {children} = props;
    useEffect(() => {
        props.fetchRouteAddresses()
    }, []);

    return (
        <Grid className="appLayout">
            <NavBar />
            {children}
            <Footer />
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    routeAddress: state.routeAddress
});

const connector = connect(mapState, {fetchRouteAddresses});
export default connector(Layout);
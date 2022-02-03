import React, {useEffect} from 'react';
import './index.scss'
import Grid from "@material-ui/core/Grid";
import {Footer} from "../Footer";
import {NavBar} from "../NavBar";
import {connect, ConnectedProps} from "react-redux";

import {RootState} from "../../../rootReducer";
import {fetchAuthRouteAddresses} from "./actions";
import {checkAuthentication} from "../../../modules/authentication/pages/Auth/methods";
import {setAuthentication, setEnv, setLanguage} from "../../../modules/authentication/pages/Auth/actions";
import {
    fetchApplicationNames,
    fetchAssetsRouteAddress,
    fetchDataRouteAddresses
} from "../../../modules/dashboard/pages/home/actions";
import {getItemFromLocalStorage} from "../../../utils/tools";
import {LOCAL_STORAGE_ENV, LOCAL_STORAGE_LANGUAGE} from "../../../utils/constants";
import {Paper} from "@material-ui/core";

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
        props.fetchAssetsRouteAddress();
        const isAuthenticated = checkAuthentication();
        if(isAuthenticated) {
            props.fetchApplicationNames();
        }
        setAuthentication(isAuthenticated);
        const env = getItemFromLocalStorage(LOCAL_STORAGE_ENV);
        if (!env) {
            props.setEnv();
        }
        const language = getItemFromLocalStorage(LOCAL_STORAGE_LANGUAGE);
        if(!language) {
            props.setLanguage();
        }
    }, []);

    return (
        <Grid className="appLayout">
            <NavBar />
            <Grid className="app-child-container">
                <div className="paper">
                    {children}
                </div>
            </Grid>
            <Footer />
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    routeAddress: state.routeAddress
});

const connector = connect(mapState, {
    setEnv, setLanguage, fetchAssetsRouteAddress,
    fetchApplicationNames,
    fetchAuthRouteAddresses, setAuthentication, fetchDataRouteAddresses
});
export default connector(Layout);
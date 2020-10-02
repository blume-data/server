import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchDataRouteAddresses} from "./actions";

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home = (props: PropsFromRedux) => {

    const {fetchDataRouteAddresses, dataRoutes} = props;

    // fetch the data routes
    useEffect(() => {
        fetchDataRouteAddresses();
    },[]);

    console.log('data', dataRoutes);


    return (
        <Grid>
            Hello
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    dataRoutes: state.routeAddress.routes.data
});

const connector = connect(mapState, {fetchDataRouteAddresses});
export default connector(Home);
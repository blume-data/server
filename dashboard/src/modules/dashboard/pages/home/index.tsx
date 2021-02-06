import React from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {Paper, Card, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import {dashboardApplicationNamesUrl} from "../../../../utils/urls";

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home = (props: PropsFromRedux) => {

    const {dataRoutes} = props;

    return (
        <Grid>
            <Paper elevation={3}>
                <Grid container justify={"center"}>
                    <Grid item lg={4} xl={12}>
                        <Card>
                            <CardContent>
                                <Link to={dashboardApplicationNamesUrl}>
                                    <Typography component={'h4'} variant={'h4'}>
                                        Application Spaces
                                    </Typography>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    dataRoutes: state.routeAddress.routes.data
});

const connector = connect(mapState);
export default connector(Home);
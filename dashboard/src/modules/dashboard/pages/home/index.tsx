import React from "react";
import Grid from "@material-ui/core/Grid";
import { RootState } from "../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import { Paper, Card, CardContent, ListItem, List } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { dashboardApplicationNamesUrl } from "../../../../utils/urls";
import { Button } from "../../../../components/common/Button";

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home = (props: PropsFromRedux) => {
  const { dataRoutes } = props;

  return (
    <Grid>
      <Grid container justify="flex-end">
        <Grid item>
          <Link to={dashboardApplicationNamesUrl}>
            <Button name="Application Spaces" />
          </Link>
        </Grid>
      </Grid>
      {/* <Paper elevation={3}> */}
      <Grid container justify={"center"}>
        <Grid item lg={4} xl={12}>
          <List>
            <ListItem>
              <Typography component={"h4"} variant={"h4"}>
                Manage your application spaces
              </Typography>
            </ListItem>
            <ListItem>
              You can create different application spaces for different
              applications.
            </ListItem>
            <ListItem>
              Consider it as a wrapper within which you can create different
              working enviornments
            </ListItem>
            <ListItem>
              Withing different enviornments you can create diffent models and
              records.
            </ListItem>
            <ListItem>
              Every thing will be encapsulated under an application space
            </ListItem>
          </List>
        </Grid>
      </Grid>
      {/* </Paper> */}
    </Grid>
  );
};

const mapState = (state: RootState) => ({
  dataRoutes: state.routeAddress.routes.data,
});

const connector = connect(mapState);
export default connector(Home);


import Grid from "@mui/material/Grid";
import { RootState } from "../../../../rootReducer";
import { connect } from "react-redux";
import { ListItem, List } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { dashboardApplicationNamesUrl } from "../../../../utils/urls";
import { Button } from "../../../../components/common/Button";

// type PropsFromRedux = ConnectedProps<typeof connector>;

const Home = (/*props: PropsFromRedux*/) => {
  
  return (
    <Grid>
      <Grid container={true} justifyContent="flex-end">
        <Grid item={true}>
          <Link to={dashboardApplicationNamesUrl}>
            <Button name="Application Spaces" />
          </Link>
        </Grid>
      </Grid>
      {/* <Paper elevation={3}> */}
      <Grid container={true} justifyContent={"center"}>
        <Grid item={true} lg={4} xl={12}>
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

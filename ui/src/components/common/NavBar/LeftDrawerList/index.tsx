import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ListItemText from "@mui/material/ListItemText";
import AdjustIcon from "@mui/icons-material/Adjust";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import {
  assetsUrl,
  dashbaordUserUrl,
  dashboardApplicationNamesUrl,
  dashboardDataEntriesUrl,
  dashboardDataModelsUrl,
  dashboardEnvUrl,
  dashboardHomeUrl,
} from "../../../../utils/urls";
import { Grid } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import "./style.scss";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../rootReducer";
import NoteIcon from "@mui/icons-material/Note";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { APPLICATION_NAME, ENV } from "@ranjodhbirkaur/constants";
import { setEnv } from "../../../../modules/authentication/pages/Auth/actions";
import { PersonAdd } from "@mui/icons-material";

type PropsFromRedux = ConnectedProps<typeof connector>;

const LeftDrawerListComponent = (props: PropsFromRedux) => {
  const { applicationName, selectedEnv } = props;

  const dataModelsUrl = `${dashboardDataModelsUrl.replace(
    ":applicationName",
    applicationName
  )}`;

  const dataEntriesUrl = `${dashboardDataEntriesUrl
    .replace(":applicationName", applicationName)
    .replace(":modelName?", "")}`;

  const EnvUrl = `${dashboardEnvUrl.replace(
    `:${APPLICATION_NAME}`,
    applicationName
  )}`;

  const UserUrl = `${dashbaordUserUrl
    .replace(`:${APPLICATION_NAME}`, applicationName)
    .replace(`:${ENV}`, selectedEnv)
    .replace(`:type?`, "")}`;

  const GroupUserUrl = `${dashbaordUserUrl
    .replace(`:${APPLICATION_NAME}`, applicationName)
    .replace(`:${ENV}`, selectedEnv)
    .replace(`:type?`, "group")}`;

  return (
    <Grid className={"left-drawer-list"}>
      <Divider />
      <List>
        <ListItem button>
          <Link className={"link-item-link"} to={dashboardHomeUrl}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </Link>
        </ListItem>
        <ListItem button>
          <Link className={"link-item-link"} to={dashboardApplicationNamesUrl}>
            <ListItemIcon>
              <ApartmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <div>
                  Application space: <b>{applicationName}</b>
                </div>
              }
            />
          </Link>
        </ListItem>
        {applicationName ? (
          <div>
            <Link className={"link-item-link"} to={EnvUrl}>
              <ListItem button>
                <ListItemIcon>
                  <AdjustIcon />
                </ListItemIcon>
                <ListItemText
                  title={`selected Env: ${selectedEnv}`}
                  className="env-title"
                  primary={
                    <div>
                      Env: <b>{selectedEnv}</b>
                    </div>
                  }
                />
              </ListItem>
            </Link>

            {/* <Link className={'link-item-link'} to={dashboardApplicationNamesUrl}>
                                <ListItem button>
                                <ListItemIcon><LanguageIcon /></ListItemIcon>
                                <ListItemText primary={'Languages'} />
                                </ListItem>
                        </Link> */}

            <Link className={"link-item-link"} to={dataModelsUrl}>
              <ListItem button>
                <ListItemIcon>
                  <WidgetsIcon />
                </ListItemIcon>
                <ListItemText primary={"Models"} />
              </ListItem>
            </Link>

            <Link className={"link-item-link"} to={dataEntriesUrl}>
              <ListItem button>
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText primary={"Entries"} />
              </ListItem>
            </Link>

            <Link className={"link-item-link"} to={assetsUrl}>
              <ListItem button>
                <ListItemIcon>
                  <PhotoAlbumIcon />
                </ListItemIcon>
                <ListItemText primary={"Assets"} />
              </ListItem>
            </Link>

            <Link className={"link-item-link"} to={UserUrl}>
              <ListItem button>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItem>
            </Link>

            <Link className={"link-item-link"} to={GroupUserUrl}>
              <ListItem button>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary={"User Group"} />
              </ListItem>
            </Link>
          </div>
        ) : null}
      </List>
    </Grid>
  );
};

const mapState = (state: RootState) => ({
  applicationName: state.authentication.applicationName,
  applicationNames: state.authentication.applicationsNames,
  selectedEnv: state.authentication.env,
});
const connector = connect(mapState, { setEnv });
export const LeftDrawerList = connector(LeftDrawerListComponent);

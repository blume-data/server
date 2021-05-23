import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ApartmentIcon from '@material-ui/icons/Apartment';
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import {
    assetsUrl,
    dashboardApplicationNamesUrl, dashboardDataEntriesUrl,
    dashboardDataModelsUrl,
    dashboardEnvUrl,
    dashboardHomeUrl
} from "../../../../utils/urls";
import {Grid} from "@material-ui/core";
import DashboardIcon from '@material-ui/icons/Dashboard';
import LanguageIcon from '@material-ui/icons/Language';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import './style.scss';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import NoteIcon from '@material-ui/icons/Note';
import WidgetsIcon from '@material-ui/icons/Widgets';
import { APPLICATION_NAME } from "@ranjodhbirkaur/constants";

type PropsFromRedux = ConnectedProps<typeof connector>;

const LeftDrawerListComponent = (props: PropsFromRedux) => {
    const {applicationName} = props;

    const dataModelsUrl = `${dashboardDataModelsUrl
        .replace(':applicationName',applicationName)
    }`;

    const dataEntriesUrl = `${dashboardDataEntriesUrl
        .replace(':applicationName',applicationName)
        .replace(':modelName?', '')
    }`;

    const EnvUrl = `${dashboardEnvUrl.replace(`:${APPLICATION_NAME}`, applicationName)}`;

    return (
        <Grid className={'left-drawer-list'}>
            <Divider />
            <List>
                <ListItem button>
                    <Link className={'link-item-link'} to={dashboardHomeUrl}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link className={'link-item-link'} to={dashboardApplicationNamesUrl}>
                        <ListItemIcon><ApartmentIcon /></ListItemIcon>
                        <ListItemText primary={'Application Space'} />
                    </Link>
                </ListItem>
                {
                    applicationName
                    ? <div>
                        <ListItem button>
                            <Link className={'link-item-link'} to={EnvUrl}>
                                <ListItemIcon><LanguageIcon /></ListItemIcon>
                                <ListItemText primary={'Env'} />
                            </Link>
                        </ListItem>
                        <ListItem button>
                            <Link className={'link-item-link'} to={dashboardApplicationNamesUrl}>
                                <ListItemIcon><LanguageIcon /></ListItemIcon>
                                <ListItemText primary={'Languages'} />
                            </Link>
                        </ListItem>
                        <ListItem button>
                            <Link className={'link-item-link'} to={dataModelsUrl}>
                                <ListItemIcon><WidgetsIcon /></ListItemIcon>
                                <ListItemText primary={'Models'} />
                            </Link>
                        </ListItem>
                        <ListItem button>
                            <Link className={'link-item-link'} to={dataEntriesUrl}>
                                <ListItemIcon><NoteIcon /></ListItemIcon>
                                <ListItemText primary={'Entries'} />
                            </Link>
                        </ListItem>
                        <ListItem button>
                            <Link className={'link-item-link'} to={assetsUrl}>
                                <ListItemIcon><PhotoAlbumIcon /></ListItemIcon>
                                <ListItemText primary={'Assets'} />
                            </Link>
                        </ListItem>
                      </div>
                    : null
                }

            </List>
        </Grid>
    );
}

const mapState = (state: RootState) => ({
    applicationName: state.authentication.applicationName
});
const connector = connect(mapState);
export const LeftDrawerList = connector(LeftDrawerListComponent);
import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ApartmentIcon from '@material-ui/icons/Apartment';
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import {dashboardApplicationNamesUrl, dashboardHomeUrl} from "../../../../utils/urls";
import {Grid} from "@material-ui/core";
import DashboardIcon from '@material-ui/icons/Dashboard';
import LanguageIcon from '@material-ui/icons/Language';
import './style.scss';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
type PropsFromRedux = ConnectedProps<typeof connector>;

const LeftDrawerListComponent = (props: PropsFromRedux) => {
    const {applicationName} = props;
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
                    ? <ListItem button>
                            <Link className={'link-item-link'} to={dashboardApplicationNamesUrl}>
                                <ListItemIcon><LanguageIcon /></ListItemIcon>
                                <ListItemText primary={'Languages'} />
                            </Link>
                        </ListItem>
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
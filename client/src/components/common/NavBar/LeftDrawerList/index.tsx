import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ApartmentIcon from '@material-ui/icons/Apartment';
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import {dashboardApplicationNamesUrl} from "../../../../utils/urls";
import {Grid} from "@material-ui/core";
import './style.scss';

export const LeftDrawerList = () => {
    return (
        <Grid className={'left-drawer-list'}>
            <Divider />
            <List>
                <ListItem button>
                    <Link className={'link-item-link'} to={dashboardApplicationNamesUrl}>
                        <ListItemIcon><ApartmentIcon /></ListItemIcon>
                        <ListItemText primary={'Application Space'} />
                    </Link>
                </ListItem>

            </List>
        </Grid>
    );
}
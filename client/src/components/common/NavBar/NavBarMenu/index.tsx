import React from "react";
import {Grid} from "@material-ui/core";
import {ApplicationNameList} from "../ApplicationNameList";

export const NavBarMenu = () => {

    return (
        <Grid className={'nav-bar-menu-container'}>
            <ApplicationNameList />
        </Grid>
    );
};
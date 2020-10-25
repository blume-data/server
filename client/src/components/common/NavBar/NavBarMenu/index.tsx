import React, {Fragment} from "react";
import {Grid} from "@material-ui/core";
import {ApplicationNameList} from "../ApplicationNameList";
import {Link} from "react-router-dom";
import './nav-bar-menu.scss';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {setApplicationName} from "../../../../modules/authentication/pages/Auth/actions";
import {dashboardDataEntriesUrl, dashboardDataModelsUrl} from "../../../../utils/urls";
import Button from "@material-ui/core/Button";

type PropsFromRedux = ConnectedProps<typeof connector>;
const NavBarMenuComponent = (props: PropsFromRedux) => {

    const {applicationName} = props;

    const dataModelsUrl = `${dashboardDataModelsUrl
        .replace(':applicationName',applicationName)
    }`;

    const dataEntriesUrl = `${dashboardDataEntriesUrl
        .replace(':applicationName',applicationName)
    }`

    return (
        <Grid className={'nav-bar-menu-container'}>
            <ApplicationNameList />
            {
                applicationName
                ? <Fragment>
                    <Link className={'nav-bar-menu-link-item'} to={dataModelsUrl}>
                        <Button>
                            Models
                        </Button>
                    </Link>
                    <Link className={'nav-bar-menu-link-item'} to={dataEntriesUrl}>
                        <Button>
                            Entries
                        </Button>
                    </Link>
                  </Fragment>
                : null
            }
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName
    }
};

const connector = connect(mapState, {setApplicationName});
export const NavBarMenu = connector(NavBarMenuComponent);
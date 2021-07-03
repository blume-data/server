import {Fragment} from "react";
import {Grid} from "@material-ui/core";
import {ApplicationNameList} from "../ApplicationNameList";
import {Link} from "react-router-dom";
import './nav-bar-menu.scss';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {setApplicationName} from "../../../../modules/authentication/pages/Auth/actions";
import {assetsUrl, dashboardDataEntriesUrl, dashboardDataModelsUrl} from "../../../../utils/urls";
import {CommonButton} from "../../CommonButton";

type PropsFromRedux = ConnectedProps<typeof connector>;
const NavBarMenuComponent = (props: PropsFromRedux) => {

    const {applicationName} = props;

    const dataModelsUrl = `${dashboardDataModelsUrl
        .replace(':applicationName',applicationName)
    }`;

    const dataEntriesUrl = `${dashboardDataEntriesUrl
        .replace(':applicationName',applicationName)
        .replace(':modelName?', '')
    }`

    return (
        <Grid className={'nav-bar-menu-container'}>
            <ApplicationNameList />
            {
                applicationName
                ? <Fragment>
                    
                    <Link className={'nav-bar-menu-link-item'} to={dataModelsUrl}>
                        <CommonButton
                            name={'Models'}
                            variant={'text'}
                        />
                    </Link>
                    <Link className={'nav-bar-menu-link-item'} to={dataEntriesUrl}>
                        <CommonButton
                            name={'Entries'}
                            variant={'text'}
                        />
                    </Link>
                    <Link className={'nav-bar-menu-link-item'} to={assetsUrl}>
                        <CommonButton
                            name={'Assets'}
                            variant={'text'}
                        />
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
import React, {useEffect, useState} from "react";
import {MenuList} from "../MenuList";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAME, APPLICATION_NAMES} from "@ranjodhbirkaur/constants";
import {dashboardApplicationNameUrl} from "../../../../utils/urls";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {setApplicationName} from "../../../../modules/authentication/pages/Auth/actions";
import {useHistory} from "react-router";
import {LOCAL_STORAGE_SELECTED_APPLICATION_NAME} from "../../../../utils/constants";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const ApplicationNameListComponent = (props: PropsFromRedux) => {

    const {applicationName, setApplicationName} = props;
    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const history = useHistory();

    function updateApplicationNames() {
        const s = getItemFromLocalStorage(APPLICATION_NAMES);
        if(s) {
            //debugger
            setApplicationNames(JSON.parse(s));
        }
        const selectedApplicationName = getItemFromLocalStorage(LOCAL_STORAGE_SELECTED_APPLICATION_NAME);
        if(selectedApplicationName) {
            setApplicationName(selectedApplicationName);
        }
    }

    function onSelectApplicationName(name: string) {
        setApplicationName(name);
        const applicationNameUrl = dashboardApplicationNameUrl.replace(`:${APPLICATION_NAME}`, name);
        history.push(applicationNameUrl);
    }

    // fetch the data routes
    useEffect(() => {
        updateApplicationNames();
    },[]);

    console.log('applicatoin name', applicationName);

    return (
        <MenuList
            id={'nav-bar-application-name-menu'}
            onSelectMenuItem={onSelectApplicationName}
            menuItems={applicationNames || ['']}
            menuName={applicationName}
            defaultName={'application space'}
        />
    );
};

const mapState = (state: RootState) => ({
    applicationName: state.authentication.applicationName
});
const connector = connect(mapState, {setApplicationName});
export const ApplicationNameList = connector(ApplicationNameListComponent);
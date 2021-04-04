import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ModalDialog from "../../../../components/common/ModalDialog";
import {getApplicationNamesLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAME} from "@ranjodhbirkaur/constants";
import {CreateApplicationName} from "./create-application-name";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import './application-name.scss';
import {Link} from "react-router-dom";
import {dashboardApplicationNameUrl} from "../../../../utils/urls";
import {setApplicationName} from "../../../authentication/pages/Auth/actions";
import {useHistory} from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

const ApplicationNames = (props: PropsFromRedux) => {

    const {ApplicationNameUrl, setApplicationName} = props;
    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const history = useHistory();

    function updateApplicationNames() {
        setApplicationNames(getApplicationNamesLocalStorage());
    }

    // fetch the data routes
    useEffect(() => {
        updateApplicationNames();
    },[]);

    function closeModal(resp?: string) {
        console.log('resp', resp)
        updateApplicationNames();
        setIsModalOpen(false);
    }

    function onCreateApplicationName(applicationName: string) {
        closeModal('');
        const url = dashboardApplicationNameUrl.replace(`:${APPLICATION_NAME}`, applicationName);
        setApplicationName(applicationName);
        history.push(url);
    }

    function onClickLink(name: string) {
        setApplicationName(name);
    }

    return (
        <Grid className={'application-name-container'}>
            Application names
            <Grid container justify={"center"} className={'application-spaces-list'} direction={"column"}>
                {applicationNames && applicationNames.map((applicationName, index) => {
                    return (
                        <Link key={index}
                              onClick={() => onClickLink(applicationName)}
                              to={dashboardApplicationNameUrl.replace(`:${APPLICATION_NAME}`, applicationName)}>
                            <Grid className="application-space-list-item" item >
                                {applicationName}
                            </Grid>
                        </Link>
                    );
                })}
            </Grid>

            <Grid container justify={"center"} className={'button-section'}>
                <Grid container justify={"center"} className={'button-group'}>
                    <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Create Space
                    </Button>
                </Grid>
            </Grid>

            <ModalDialog
                isOpen={isModalOpen}
                title={'Create Application Space'}
                handleClose={closeModal}>
                <CreateApplicationName
                    handleClose={onCreateApplicationName}
                    url={ApplicationNameUrl ? ApplicationNameUrl : ''}/>
            </ModalDialog>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        ApplicationNameUrl: state.routeAddress.routes.data?.ApplicationNameUrl,
        applicationNames: state.authentication.applicationsNames
    }
};

const connector = connect(mapState, {setApplicationName});
export default connector(ApplicationNames);
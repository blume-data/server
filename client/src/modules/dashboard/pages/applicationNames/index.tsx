import React, {useEffect, useState} from "react";
import {Grid, Paper} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import ModalDialog from "../../../../components/common/ModalDialog";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAMES} from "@ranjodhbirkaur/constants";
import {CreateApplicationName} from "./create-application-name";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import './application-name.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;
const ApplicationNames = (props: PropsFromRedux) => {

    const {ApplicationNameUrl} = props;

    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function updateApplicationNames() {
        const s = getItemFromLocalStorage(APPLICATION_NAMES);
        if(s) {
            setApplicationNames(JSON.parse(s));
        }
    }

    // fetch the data routes
    useEffect(() => {
        updateApplicationNames();
    },[]);

    function closeModal() {
        updateApplicationNames();
        setIsModalOpen(false);
    }

    console.log('routes', ApplicationNameUrl);


    return (
        <Grid className={'application-name-container'}>
            Application names


            <Paper elevation={3}>
                <Grid container justify={"center"} className={'application-spaces-list'} direction={"column"}>
                    {applicationNames && applicationNames.map((applicationName, index) => {
                        return (
                            <Grid className={'application-space-list-item'} item key={index}>
                                {applicationName}
                            </Grid>
                        );
                    })}
                </Grid>

                <Grid container justify={"center"} className={'button-section'}>
                    <Grid container justify={"center"} className={'button-group'}>
                        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                            Create Space
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
                            Delete Space
                        </Button>
                    </Grid>
                </Grid>

                <ModalDialog
                    isOpen={isModalOpen}
                    title={'Create Application Space'}
                    handleClose={closeModal}>
                    <CreateApplicationName
                        handleClose={closeModal}
                        url={ApplicationNameUrl ? ApplicationNameUrl : ''}/>
                </ModalDialog>
            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        ApplicationNameUrl: state.routeAddress.routes.data?.ApplicationNameUrl
    }
};

const connector = connect(mapState);
export default connector(ApplicationNames);
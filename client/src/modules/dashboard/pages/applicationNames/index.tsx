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

type PropsFromRedux = ConnectedProps<typeof connector>;
const ApplicationNames = (props: PropsFromRedux) => {

    const {dataRoutes} = props;

    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // fetch the data routes
    useEffect(() => {
        const s = getItemFromLocalStorage(APPLICATION_NAMES);
        if(s) {
            setApplicationNames(JSON.parse(s));
        }
    },[]);

    function closeModal() {
        setIsModalOpen(false);
    }

    console.log('routes', dataRoutes);


    return (
        <Grid>
            Application names


            <Paper elevation={3}>
                <Button onClick={() => setIsModalOpen(true)}>
                    Open
                </Button>
                <List>
                    <ListItem button>
                        {applicationNames && applicationNames.map((applicationName, index) => {
                            return (
                                <ListItemText key={index}>
                                    {applicationName}
                                </ListItemText>
                            );
                        })}
                    </ListItem>
                </List>

                <ModalDialog
                    isOpen={isModalOpen}
                    title={'hello'}
                    handleClose={closeModal}>
                    <CreateApplicationName url={''}/>
                </ModalDialog>
            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        dataRoutes: state.routeAddress.routes.data?.ApplicationNameUrl
    }
};

const connector = connect(mapState);
export default connector(ApplicationNames);
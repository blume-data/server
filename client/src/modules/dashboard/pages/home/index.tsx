import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchDataRouteAddresses} from "./actions";
import {APPLICATION_NAMES} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ModalDialog from "../../../../components/common/ModalDialog";

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home = (props: PropsFromRedux) => {

    const {fetchDataRouteAddresses, dataRoutes} = props;
    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // fetch the data routes
    useEffect(() => {
        fetchDataRouteAddresses();
        const s = getItemFromLocalStorage(APPLICATION_NAMES);
        if(s) {
            setApplicationNames(JSON.parse(s));
        }
    },[]);

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <Grid>

            <Typography variant={"h3"}>
                Following are your Application Spaces:
            </Typography>

            <Paper elevation={3}>
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
                <Button onClick={() => setIsModalOpen(true)}>
                    Open
                </Button>
                <ModalDialog
                    isOpen={isModalOpen}
                    title={'hello'}
                    handleClose={closeModal}>
                    <h3>Hello</h3>
                </ModalDialog>
            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => ({
    dataRoutes: state.routeAddress.routes.data
});

const connector = connect(mapState, {fetchDataRouteAddresses});
export default connector(Home);
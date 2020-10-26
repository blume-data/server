import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {useParams} from "react-router";
import ModalDialog from "../../../../components/common/ModalDialog";
import {CreateDataModelItem} from "./CreateDataModellItem";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";


type PropsFromRedux = ConnectedProps<typeof connector>;
/*Fetch the model info and schema*/
/*Create a new data entry in this model*/
const DataModelComponent = (props: PropsFromRedux) => {

    const {modelName} = useParams();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function closeModal() {
        setIsModalOpen(false);
    }

    const {GetDataModelUrl, env, applicationName} = props;

    async function getModelData() {
        // /data/:env/:clientUserName/:applicationName/model/:modelName
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

        if(GetDataModelUrl && clientUserName) {
            const url = GetDataModelUrl
                .replace(':env', env)
                .replace(`:${CLIENT_USER_NAME}`, clientUserName)
                .replace(`:${APPLICATION_NAME}`, applicationName)
                .replace(`:modelName`, modelName)
            ;
            const response = await doGetRequest(`${getBaseUrl()}${url}`,null, true);
            console.log('response', response);
        }
    }

    useEffect(() => {
        getModelData();
    }, []);

    return (
        <Grid className={'data-model-container'}>

            <Paper elevation={2}>
                <Grid className={'filter-section'} container justify={"space-between"}>
                    <Grid item>
                        <TextField id="filter-stores" label="Filter" />
                    </Grid>
                    <Grid item className={'add-store-button'}>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant="contained"
                            color={'primary'}>
                            Add {modelName}
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <ModalDialog
                isOpen={isModalOpen}
                title={'Create Store'}
                handleClose={closeModal}>
                <CreateDataModelItem

                />
            </ModalDialog>

        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        applicationName: state.authentication.applicationName,
        GetDataModelUrl: state.routeAddress.routes.data?.GetDataModelUrl
    }
};

const connector = connect(mapState);
export const DataModel = connector(DataModelComponent);
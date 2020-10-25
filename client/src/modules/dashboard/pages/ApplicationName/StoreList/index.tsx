import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {getBaseUrl} from "../../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import './store-list.scss';
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {doGetRequest} from "../../../../../utils/baseApi";
import BasicTableMIUI from "../../../../../components/common/BasicTableMIUI";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ModalDialog from "../../../../../components/common/ModalDialog";
import CreateStore from "./create-store";
import Paper from "@material-ui/core/Paper";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";

type PropsFromRedux = ConnectedProps<typeof connector>;
const StoreList = (props: PropsFromRedux) => {
    const {applicationName, env, language, GetCollectionNamesUrl} = props;
    const [stores, setStores] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    async function getCollectionNames() {
        if(GetCollectionNamesUrl) {

            const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const fullUrl = `${getBaseUrl()}${url}`;
            const response = await doGetRequest(fullUrl, null, true);
            if(response && Array.isArray(response)) {
                setStores(response.map(item => {
                    const updatedAt = moment(item.updatedAt).fromNow();
                    const updatedBy = item.updatedBy.split('-')[1];
                    return {
                        ...item,
                        updatedAt,
                        updatedBy
                    }
                }));
            }
        }
    }

    useEffect(() => {
        getCollectionNames();
    }, [applicationName, env, language, GetCollectionNamesUrl]);

    const tableRows = [
        {name: 'Name', value: 'name'},
        {name: 'Description', value: 'description'},
        {name: 'Updated by', value: 'updatedBy'},
        {name: 'Updated At', value: 'updatedAt'},
    ]

    function closeModal() {
        setIsModalOpen(false);
    }

    function onCreateDataModel() {
        closeModal();
        getCollectionNames();
    }


    return (
        <Grid className={'store-list-container'}>

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
                            Add Store
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <Grid container justify={"center"} className={'stores-list'} direction={"column"}>

                {
                    stores && stores.length ? <BasicTableMIUI
                        rows={stores}
                        tableRows={tableRows}
                        tableName={'stores'}
                    /> : <p>No stores</p>
                }
            </Grid>

            <ModalDialog
                isOpen={isModalOpen}
                title={'Create Store'}
                handleClose={closeModal}>
                <CreateStore
                    onCreateDataModel={onCreateDataModel}
                />
            </ModalDialog>

        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl
    }
};

const connector = connect(mapState);
export default connector(StoreList);
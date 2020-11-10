import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {dashboardDataEntriesUrl, getBaseUrl} from "../../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import './store-list.scss';
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {doGetRequest} from "../../../../../utils/baseApi";
import BasicTableMIUI from "../../../../../components/common/BasicTableMIUI";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ModalDialog from "../../../../../components/common/ModalDialog";
import CreateDataModel, {PropertiesType} from "./CreateDataModel";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ModelDataType {
    modelId: string;
    modelName: string;
    modelDescription: string;
    modelDisplayName: string;
    modelProperties: PropertiesType[]
}

const DataModels = (props: PropsFromRedux) => {
    const {applicationName, env, language, GetCollectionNamesUrl} = props;
    const [stores, setStores] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    const [modelData, setModelData] = useState<ModelDataType | null>(null);

    function onClickEdit(id: string, name: string, description: string, displayName: string, rules: any) {
        setModelData({
            modelId: id,
            modelDescription: description,
            modelDisplayName: displayName,
            modelName: name,
            modelProperties: rules
        });
        setIsModalOpen(true);
    }

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
                        linkUrl: `${dashboardDataEntriesUrl
                            .replace(':modelName?', item.name)
                            .replace(':applicationName',applicationName)
                        }`,
                        edit: <IconButton><EditIcon /></IconButton>,
                        delete: <IconButton><DeleteIcon /></IconButton>,
                        'delete-click': () => alert('delete clicked'),
                        'edit-click': () => onClickEdit(item.id, item.name, item.description, item.displayName, JSON.parse(item.rules)),
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
        {name: 'Name', value: 'displayName', linkUrl: true},
        {name: 'Description', value: 'description'},
        {name: 'Updated by', value: 'updatedBy'},
        {name: 'Updated At', value: 'updatedAt'},
        {name: 'EDIT', value: 'edit', onClick: true},
        {name: 'Delete', value: 'delete', onClick: true}
    ]

    function closeModal() {
        setIsModalOpen(false);
    }

    function onCreateDataModel() {
        closeModal();
        getCollectionNames();
    }

    function onClickAddModel() {
        // redirect to create model page
        setIsModalOpen(true)
        setModelData(null);
    }


    return (
        <Grid className={'store-list-container'}>

            <Grid className={'filter-section'} container justify={"space-between"}>
                <Grid item>
                    <TextField id="filter-stores" label="Filter" />
                </Grid>
                <Grid item className={'add-store-button'}>
                    {/*open model and clear model data*/}
                    <Button
                        onClick={onClickAddModel}
                        variant="contained"
                        color={'primary'}>
                        Add model
                    </Button>
                </Grid>

            </Grid>

            <Grid container justify={"center"} className={'stores-list'} direction={"column"}>

                {
                    stores && stores.length ? <BasicTableMIUI
                        rows={stores}
                        tableRows={tableRows}
                        tableName={'stores'}
                    /> : <p>No models</p>
                }
            </Grid>

            <ModalDialog
                isOpen={isModalOpen}
                title={'Data Model'}
                handleClose={closeModal}>
                <CreateDataModel
                    modelId={modelData?.modelId}
                    modelDescription={modelData?.modelDescription}
                    modelDisplayName={modelData?.modelDisplayName}
                    modelName={modelData?.modelName}
                    modelProperties={modelData?.modelProperties}
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
export default connector(DataModels);
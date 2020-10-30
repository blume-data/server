import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {useParams} from "react-router";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";
import ModalDialog from "../../../../components/common/ModalDialog";

type PropsFromRedux = ConnectedProps<typeof connector>;
const dataEntriesComponent = (props: PropsFromRedux) => {

    const {env, applicationName, GetCollectionNamesUrl, language, StoreUrl} = props;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function closeModal() {
        setIsModalOpen(false);
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {modelName} = useParams();

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    async function getData() {
        if(GetCollectionNamesUrl) {
            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(`:${APPLICATION_NAME}`,applicationName);
            let data: any = {};
            if(modelName) {
                data.name = modelName;
            }

            const response = await doGetRequest(`${getBaseUrl()}${url}`, data, true);
            console.log('res', response);
        }
    }

    // Fetch records in the model
    async function getItems() {
        if(StoreUrl) {
            const url = StoreUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(':collectionName', modelName)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const response = await doGetRequest(`${getBaseUrl()}${url}`, null, true);
            console.log('items', response);
        }

    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getData();
        getItems();
    }, [modelName, GetCollectionNamesUrl]);

    return (
        <Grid>
            <Grid className="data-entries">

            </Grid>
            <ModalDialog
                isOpen={isModalOpen}
                title={'Create Store'}
                handleClose={closeModal}>
                <h2>
                    sdf
                </h2>
            </ModalDialog>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl
    }
};

const connector = connect(mapState);
export const DataEntries = connector(dataEntriesComponent);
import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {dashboardCollectionsUrl, getBaseUrl} from "../../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {Link} from "react-router-dom";
import './store-list.scss';
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {doGetRequest} from "../../../../../utils/baseApi";
import BasicTableMIUI from "../../../../../components/common/BasicTableMIUI";
import moment from "moment";

interface StoreListProps {
    env: string;
    language: string;
    applicationName: string;
    GetCollectionNamesUrl: string;
}
export const StoreList = (props: StoreListProps) => {
    const {applicationName, env, language, GetCollectionNamesUrl} = props;
    const [stores, setStores] = useState<any>(null);

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
        {name: 'Description', value: 'description'},
        {name: 'Updated by', value: 'updatedBy'},
        {name: 'Name', value: 'name'},
        {name: 'Updated At', value: 'updatedAt'},
    ]


    return (
        <Grid className={'application-name-store-list'}>

            <Grid container justify={"center"} className={'stores-list'} direction={"column"}>

                {
                    stores && stores.length ? <BasicTableMIUI
                        rows={stores}
                        tableRows={tableRows}
                        tableName={'stores'}
                    /> : <p>No stores</p>
                }
            </Grid>
        </Grid>
    );
};
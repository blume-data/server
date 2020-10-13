import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {dashboardCollectionsUrl, getBaseUrl} from "../../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {Link} from "react-router-dom";
import './store-list.scss';
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {doGetRequest} from "../../../../../utils/baseApi";

interface StoreListProps {
    env: string;
    language: string;
    applicationName: string;
    GetCollectionNamesUrl: string;
}
export const StoreList = (props: StoreListProps) => {
    const {applicationName, env, language, GetCollectionNamesUrl} = props;
    const [stores, setStores] = useState<string[] | null>(null);

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
                const data = response.map((item: {name: string}) => {
                    return item.name;
                });
                setStores(data);
            }
        }
    }

    useEffect(() => {
        getCollectionNames();
    }, [applicationName, env, language, GetCollectionNamesUrl]);

    return (
        <Grid className={'application-name-store-list'}>
            <Grid container justify={"center"} className={'stores-list'} direction={"column"}>
                {stores && stores.map((storeName, index) => {
                    const linkUrl = dashboardCollectionsUrl
                        .replace(`:${APPLICATION_NAME}`, applicationName)
                        .replace(':store-name', storeName);
                    return (
                        <Link key={index} to={linkUrl}>
                            <Grid className="stores-list-item" item >
                                {storeName}
                            </Grid>
                        </Link>
                    );
                })}
            </Grid>
        </Grid>
    );
};
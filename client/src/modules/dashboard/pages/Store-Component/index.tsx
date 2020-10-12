import React, {useEffect, useState} from "react";
import {Grid, Paper} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {doGetRequest} from "../../../../utils/baseApi";
import {dashboardStoresUrl, getBaseUrl} from "../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {useParams} from "react-router";
import './store-page.scss';
import {Link} from "react-router-dom";

type PropsFromRedux = ConnectedProps<typeof connector>;
const StoreComponent = (props: PropsFromRedux) => {

    const {GetCollectionNamesUrl, env, language} = props;
    const [stores, setStores] = useState<string[] | null>(null);

    const {applicationName} = useParams();

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
            if(response && response.length) {
                const data = response.map((item: {name: string}) => {
                    return item.name;
                });
                setStores(data);
            }
        }
    }

    useEffect(() => {
        getCollectionNames();

    },[props.GetCollectionNamesUrl]);


    return (

        <Grid className={'store-page-container'}>
            <Paper elevation={3}>
                <Grid container justify={"center"} className={'application-spaces-list'} direction={"column"}>
                    {stores && stores.map((storeName, index) => {
                        return (
                            <Link key={index} to={dashboardStoresUrl.replace(`:${APPLICATION_NAME}`, storeName)}>
                                <Grid className="application-space-list-item" item >
                                    {storeName}
                                </Grid>
                            </Link>
                        );
                    })}
                </Grid>

            </Paper>
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl
    }
};

const connector = connect(mapState);
export default connector(StoreComponent);
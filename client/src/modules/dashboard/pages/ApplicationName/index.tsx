import React, {useEffect, useState} from "react";
import {Grid, Paper} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {doGetRequest} from "../../../../utils/baseApi";
import {dashboardCollectionsUrl, dashboardStoresUrl, getBaseUrl} from "../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {useParams} from "react-router";
import './application-name.scss';
import {Link} from "react-router-dom";
import {setApplicationName} from "../../../authentication/pages/Auth/actions";

type PropsFromRedux = ConnectedProps<typeof connector>;
const ApplicationName = (props: PropsFromRedux) => {

    const {GetCollectionNamesUrl, env, language, setApplicationName} = props;
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
        setApplicationName(applicationName);
    },[props.GetCollectionNamesUrl, applicationName, env, language]);

    return (

        <Grid className={'store-page-container'}>
            <Paper elevation={3}>
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

const connector = connect(mapState, {setApplicationName});
export default connector(ApplicationName);
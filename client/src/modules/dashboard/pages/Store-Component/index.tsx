import React, {useEffect} from "react";
import {Grid} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";
import {doGetRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {useParams} from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;
const StoreComponent = (props: PropsFromRedux) => {

    const {GetCollectionNamesUrl} = props;

    const {applicationName} = useParams();

    async function getCollectionNames() {
        if(GetCollectionNamesUrl) {
            const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(`:${APPLICATION_NAME}`,applicationName);
            console.log('ur', url);


            const urld = `${getBaseUrl()}`;
            const response = doGetRequest(``)
        }
    }

    useEffect(() => {
        getCollectionNames();

    },[props.GetCollectionNamesUrl]);


    return (

        <Grid>
            Store component
        </Grid>
    );
};

const mapState = (state: RootState) => {
    return {
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl
    }
};

const connector = connect(mapState);
export default connector(StoreComponent);
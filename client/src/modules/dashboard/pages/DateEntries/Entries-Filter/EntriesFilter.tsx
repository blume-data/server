import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getItemFromLocalStorage} from "../../../../../utils/tools";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";

type PropsFromRedux = ConnectedProps<typeof connector>;

export const EntriesFilterComponent = (props: PropsFromRedux) => {

    const {applicationName, env, language, GetEntriesUrl, } = props;
    const [modelName, setModelName] = useState<string>('');
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    async function getEntries() {
        const response = await fetchModelEntries({
            clientUserName: clientUserName ? clientUserName : '',
            applicationName, modelName, language, env,
            GetEntriesUrl: GetEntriesUrl ? GetEntriesUrl : ''
        });
        console.log('respnse', response);
    }

    useEffect(() => {
        if(modelName) {
            getEntries();
        }
    }, [modelName, GetEntriesUrl]);


    return (
        <Grid className={'entries-filter-wrapper-container'}>
            filter
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName,
        env: state.authentication.env,
        language: state.authentication.language,
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl
    }
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
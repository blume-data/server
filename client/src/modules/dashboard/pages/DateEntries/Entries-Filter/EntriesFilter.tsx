import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getItemFromLocalStorage, getModelDataAndRules} from "../../../../../utils/tools";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";

type PropsFromRedux = ConnectedProps<typeof connector>;

export const EntriesFilterComponent = (props: PropsFromRedux) => {

    const {applicationName, env, language, GetEntriesUrl, GetCollectionNamesUrl } = props;
    const [modelName, setModelName] = useState<string>('');

    async function fetchModelRulesAndData() {
        if(GetCollectionNamesUrl) {
            const response = await getModelDataAndRules({
                applicationName, language, modelName, env, GetCollectionNamesUrl
            });
            console.log('list of model', response);
        }
    }

    async function getEntries() {
        const response = await fetchModelEntries({
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

    // Fetch Model Data and Rules
    useEffect(() => {
        fetchModelRulesAndData();
    }, [GetCollectionNamesUrl]);


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
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
    }
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
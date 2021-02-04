import React from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const EntriesFilterComponent = (props: PropsFromRedux) => {
    return (
        <Grid className={'entries-filter-wrapper-container'}>
            filter
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName,
    }
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
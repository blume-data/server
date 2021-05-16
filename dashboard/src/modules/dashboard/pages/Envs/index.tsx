import React from 'react';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../rootReducer";

type PropsFromRedux = ConnectedProps<typeof connector>;
const Envs = (props: PropsFromRedux) => {

    const {applicationNames} = props;

    console.log('Application Name', applicationNames);

    return (
        <h1>hello</h1>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        applicationNames: state.authentication.applicationsNames
    }
};

const connector = connect(mapState);
export default connector(Envs);
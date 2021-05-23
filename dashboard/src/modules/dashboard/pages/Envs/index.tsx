import { Grid } from '@material-ui/core';
import React from 'react';
import {connect, ConnectedProps} from "react-redux";
import BasicTableMIUI from '../../../../components/common/BasicTableMIUI';
import {RootState} from "../../../../rootReducer";
import ApplicationName from '../ApplicationName';

type PropsFromRedux = ConnectedProps<typeof connector>;
const Envs = (props: PropsFromRedux) => {

    const {applicationNames, applicationName} = props;

    console.log('Application Name', applicationNames, applicationName);
    const env = applicationNames.find(item => item.name === applicationName);
    console.log('env', env)

    if(env)
    return (
        <Grid>
            <BasicTableMIUI 
                tableName='Envs'
                rows={env.env}
                columns={[
                    {name: "Name", value: "name"},
                    {name: 'Description', value: 'description'}
                ]}
             />
            
        </Grid>
    );
    return null;
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
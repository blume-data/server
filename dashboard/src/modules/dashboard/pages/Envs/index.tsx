import { Grid } from '@material-ui/core';
import { APPLICATION_NAME, CLIENT_USER_NAME, ErrorMessagesType } from '@ranjodhbirkaur/constants';
import React, { useState } from 'react';
import {connect, ConnectedProps} from "react-redux";
import BasicTableMIUI from '../../../../components/common/BasicTableMIUI';
import { CommonButton } from '../../../../components/common/CommonButton';
import { Form } from '../../../../components/common/Form';
import { ConfigField, TEXT } from '../../../../components/common/Form/interface';
import ModalDialog from '../../../../components/common/ModalDialog';
import {RootState} from "../../../../rootReducer";
import { doPostRequest } from '../../../../utils/baseApi';
import { getItemFromLocalStorage } from '../../../../utils/tools';
import ApplicationName from '../ApplicationName';

type PropsFromRedux = ConnectedProps<typeof connector>;
const Envs = (props: PropsFromRedux) => {

    const {applicationNames, applicationName, envUrl} = props;
    const [isModelOpen, setIsModalOpen] = useState<boolean>(false);
    const [envData, setEnvData] = useState<{name: string, description: string, order: number}>({name: '', description: '', order: 1});
    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');

    const fields: ConfigField[] = [
        {
            name: 'name',
            required: true,
            placeholder: 'Name',
            value: envData.name,
            className: 'create-content-model-name',
            type: 'text',
            label: 'Name',
            inputType: TEXT,
            descriptionText: 'name of the env'
        },
        {
            name: 'description',
            required: false,
            placeholder: 'Description',
            value: envData.description,
            className: 'create-content-model-name',
            type: 'text',
            label: 'Description',
            inputType: TEXT,
            descriptionText: 'Description of the env'
        }
    ];

    console.log('env url', envUrl);

    async function onCreateEnvHandler(values: any) {
        console.log('values', values);
        

        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

        const url = envUrl?.replace(`:${CLIENT_USER_NAME}`, clientUserName || '').replace(`:${APPLICATION_NAME}`, applicationName);

        const resp = await doPostRequest(url || '', values, true);
        if(resp && resp.errors) {
            setResponse(resp.errors);
        }
        else {
            setIsModalOpen(false);
        }
        console.log('resp', resp);


    }

    console.log('Application Name', applicationNames, applicationName);
    const env = applicationNames.find(item => item.name === applicationName);
    console.log('env', env)

    if(env)
    return (
        <Grid>
            <CommonButton
                name='Create Env'
                onClick={() => setIsModalOpen(true)}
             />
            <BasicTableMIUI 
                tableName='Envs'
                rows={env.env}
                columns={[
                    {name: "Name", value: "name"},
                    {name: 'Description', value: 'description'}
                ]}
             />

             <ModalDialog
                title='Create or update env'
                isOpen={isModelOpen}
                handleClose={() => setIsModalOpen(!isModelOpen)}
                children={
                    <Form
                        fields={fields}
                        className=''
                        onSubmit={onCreateEnvHandler}
                        response={response}
                        getValuesAsObject={true}
                     />
                }
                
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
        applicationNames: state.authentication.applicationsNames,
        envUrl: state.routeAddress.routes.auth?.envUrl,
    }
};

const connector = connect(mapState);
export default connector(Envs);
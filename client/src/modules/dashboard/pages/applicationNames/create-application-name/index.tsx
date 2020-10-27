import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../components/common/Form";
import {ConfigField, TEXT} from "../../../../../components/common/Form/interface";
import {APPLICATION_NAME, APPLICATION_NAMES, CLIENT_USER_NAME, ErrorMessagesType} from "@ranjodhbirkaur/constants";
import './create-application-name.scss';
import {doPostRequest} from "../../../../../utils/baseApi";
import {getItemFromLocalStorage} from "../../../../../utils/tools";
import {getBaseUrl} from "../../../../../utils/urls";
import {ApplicationNameType} from "../index";

interface CreateApplicationNameProps {
    url: string;
    handleClose: (applicationName: ApplicationNameType) => void;
}

export const CreateApplicationName = (props: CreateApplicationNameProps) => {

    const {handleClose} = props;
    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');

    const fields: ConfigField[] = [{
        required: true,
        placeholder: 'Application name',
        value: '',
        className: 'application-name-text-field',
        type: 'text',
        name: APPLICATION_NAME,
        label: 'Application Name',
        inputType: TEXT,
    }];

    async function onSubmit(values: any[]) {

        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        const applicationName = values[0];

        const url = props.url
            .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
            .replace(`:${APPLICATION_NAME}?`,'');

        const resp = await doPostRequest(`${getBaseUrl()}${url}`, {
            [APPLICATION_NAME]: applicationName.value
        }, true);

        if(resp && !resp.errors) {
            const applicationNames = getItemFromLocalStorage(APPLICATION_NAMES);
            if(applicationNames) {
                const parsedApplicationNames = JSON.parse(applicationNames);
                parsedApplicationNames.push(resp);
                localStorage.setItem(APPLICATION_NAMES, JSON.stringify(parsedApplicationNames));
            }

            handleClose(resp);
            setResponse('')
        }
        else {
            setResponse(resp.errors);
        }
    }


    return (
        <Grid container justify={"center"} className={'create-application-name-container'}>
            <Form response={response} className={'create-application-name-form'} fields={fields} onSubmit={onSubmit} />
        </Grid>
    );
};
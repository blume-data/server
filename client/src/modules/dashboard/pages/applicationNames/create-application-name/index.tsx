import React from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../components/common/Form";
import {ConfigField, TEXT} from "../../../../../components/common/Form/interface";
import {APPLICATION_NAME, ErrorMessagesType} from "@ranjodhbirkaur/constants";

export const CreateApplicationName = (props: {url: string}) => {

    console.log('pre', props.url);

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

    function onSubmit(values: object[]): Promise<string | ErrorMessagesType[]> {
        console.log('values', values);
        return new Promise((resolve, reject) => {
            resolve('dsfsf');
        });
    }


    return (
        <Grid container justify={"center"}>
            <Grid item>
                <Form className={'create-application-name-form'} fields={fields} onSubmit={onSubmit} />
            </Grid>

        </Grid>
    );
};
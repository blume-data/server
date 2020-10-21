import React from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../../components/common/Form";
import {ConfigField, TEXT} from "../../../../../../components/common/Form/interface";
import {APPLICATION_NAME, ErrorMessagesType} from "@ranjodhbirkaur/constants";

export const CreateStore = () => {

    const fields: ConfigField[] = [
        {
            required: true,
            placeholder: 'Display Name',
            value: '',
            className: 'create-content-model-name-text-field',
            type: 'text',
            name: 'displayName',
            label: 'Display Name',
            inputType: TEXT,
        },
        {
            required: true,
            placeholder: 'Name',
            value: '',
            className: 'create-content-model-display-name-text-field',
            type: 'text',
            name: 'name',
            label: 'Name',
            inputType: TEXT,
        },
        {
            required: true,
            placeholder: 'Description',
            value: '',
            className: 'create-content-model-description-text-field',
            type: 'text',
            name: 'description',
            label: 'Description',
            inputType: TEXT,
        },
    ];

    function onCreateContentModel(values: object[]): Promise<string | ErrorMessagesType[]> {

        console.log('value', values);

        return new Promise(async (resolve, reject) => {
            return resolve('')
        })
    }

    return (
        <Grid>
            <Grid className="create-content-model">

                <Form className={'create-content-model-form'} fields={fields} onSubmit={onCreateContentModel} />

            </Grid>
        </Grid>
    );
}
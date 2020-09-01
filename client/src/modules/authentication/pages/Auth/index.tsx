import React, {ChangeEvent, useState} from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../components/common/Form";
import {BIG_TEXT, ConfigField, DROPDOWN, TEXT} from "../../../../components/common/Form/interface";

export const Auth = () => {

    const fields: ConfigField[] = [
        {
            inputType: DROPDOWN,
            placeholder: 'First Name',
            label: 'age',
            required: true,
            value: '',
            className: 'dsf',
            name: 'firstNameDropDown',
            options: [{label: 'df', value: 'a-drop-down-value'}]
        },
        {
            inputType: BIG_TEXT,
            placeholder: 'big text',
            name: 'some name big text',
            label: 'some big text',
            required: false,
            value: 'sdf',
            className: 'dsf',
        },
        {
            inputType: TEXT,
            placeholder: 'First Name',
            label: 'First Name',
            name: 'firstName',
            required: true,
            value: '',
            className: 'auth-text-box',
        },
        {
            inputType: TEXT,
            placeholder: 'Last Name',
            name: 'lastName',
            label: 'Last Name',
            required: true,
            value: '',
            className: 'auth-text-box'
        },
    ];

    return (
        <Grid container direction={'row'} justify={'space-between'}>
            <Grid item>
                welcome

            </Grid>
            <Grid item>
                <Grid container justify={'center'}>
                    <Form fields={fields} className={'auth-form'} />
                </Grid>
            </Grid>

        </Grid>
    );
};
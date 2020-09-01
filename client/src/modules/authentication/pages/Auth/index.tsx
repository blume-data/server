import React from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../components/common/Form";
import {ConfigField, DROPDOWN, TEXT} from "../../../../components/common/Form/interface";

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
            inputType: TEXT,
            placeholder: 'Email',
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true,
            value: '',
            className: 'auth-email-text-box',
        },
        {
            inputType: TEXT,
            placeholder: 'First Name',
            label: 'First Name',
            name: 'firstName',
            type: 'text',
            required: true,
            value: '',
            className: 'auth-first-name-text-box',
        },
        {
            inputType: TEXT,
            placeholder: 'Last Name',
            label: 'Last Name',
            name: 'lastName',
            type: 'text',
            required: true,
            value: '',
            className: 'auth-last-name-text-box',
        },
        {
            inputType: TEXT,
            placeholder: 'Username',
            label: 'Username',
            name: 'userName',
            type: 'text',
            required: true,
            value: '',
            className: 'auth-user-name-text-box',
        },
        {
            inputType: TEXT,
            placeholder: 'Password',
            label: 'Password',
            name: 'password',
            type: 'password',
            required: true,
            value: '',
            className: 'auth-password-text-box',
        },
    ];

    function onSubmit(values: any) {
        console.log('submited', values);
    }

    return (
        <Grid container direction={'row'} justify={'space-between'}>
            <Grid item>
                welcome

            </Grid>
            <Grid item>
                <Grid container justify={'center'}>
                    <Form onSubmit={onSubmit} fields={fields} className={'auth-form'} />
                </Grid>
            </Grid>

        </Grid>
    );
};
import React from "react";
import {Grid} from "@material-ui/core";
import {ConfigField, TEXT} from "../../../../components/common/Form/interface";
import loadable from "@loadable/component";
import {doPostRequest} from "../../../../utils/baseApi";
import {clientUserType, register} from "@ranjodhbirkaur/common";
import {getAuthUrl} from "../../../../utils/urls";
const Form = loadable(() => import("../../../../components/common/Form"), {
    resolveComponent: (components) => components.Form
});

export const Auth = () => {

    const fields: ConfigField[] = [
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
            helperText: '',
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
        console.log('submitted', values);
        let data: any = {};
        values.forEach((value: any) => {
            data[value.name] = value.value;
        });
        authUser(data);
    }

    async function authUser(values: any) {
        const url = `${getAuthUrl(clientUserType)}/${register}`;
        const response = await doPostRequest(url, values, false);
        console.log('response', response);
    }

    return (
        <Grid container direction={'row'} justify={'space-between'}>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                welcome
            </Grid>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                <Grid container justify={'center'}>
                    <Form onSubmit={onSubmit} fields={fields} className={'auth-form'} />
                </Grid>
            </Grid>

        </Grid>
    );
};
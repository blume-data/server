import React from "react";
import Grid from "@material-ui/core/Grid";
import {ConfigField, TEXT} from "../../../../components/common/Form/interface";
import {doPostRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";
import {Form} from "../../../../components/common/Form";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {AUTH_TOKEN, ErrorMessagesType, USER_NAME} from "@ranjodhbirkaur/constants";
import {FORM_SUCCESSFULLY_SUBMITTED} from "./constants";

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ResponseType {
    errors?: ErrorMessagesType[];
    email?: string;
    id?: string;
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
}

const AuthComponent = (props: PropsFromRedux) => {

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

    async function onSubmit(values: object[]) {
        let data: any = {};
        values.forEach((value: any) => {
            data[value.name] = value.value;
        });
        return await authUser(data);
    }

    async function authUser(values: any): Promise<string | ErrorMessagesType[]> {
        const {routeAddress} = props;
        const register = routeAddress && routeAddress.register;
        const url = `${getBaseUrl()}${register}`;
        const response: ResponseType = await doPostRequest(url, values, false);
        if (response && response[AUTH_TOKEN]) {
            return FORM_SUCCESSFULLY_SUBMITTED;
        }
        else if(response && response.errors && response.errors.length) {
            return response.errors
        }
        return '';
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

const mapState = (state: RootState) => ({
    routeAddress: state.routeAddress.routes.auth
});

const connector = connect(mapState);
export const Auth = connector(AuthComponent);
import React from "react";
import Grid from "@material-ui/core/Grid";
import {doGetRequest, doPostRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {AUTH_TOKEN, ErrorMessagesType, USER_NAME} from "@ranjodhbirkaur/constants";
import {FORM_SUCCESSFULLY_SUBMITTED, REGISTRATION_TITLE} from "./constants";
import './styles.scss';
import {useHistory, useParams} from "react-router";
import {CardForm} from "./CardForm";
import {getFieldConfiguration} from "./fieldConfiguration";

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ResponseType {
    errors?: ErrorMessagesType[];
    email?: string;
    id?: string;
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
}

export const SIGN_UP = 'register';
export const SIGN_IN = 'log-in';
export const VERIFY_EMAIL = 'verify-email';

const AuthComponent = (props: PropsFromRedux) => {

    const history = useHistory();

    async function onSubmit(values: object[]) {
        let data: any = {};
        values.forEach((value: any) => {
            data[value.name] = value.value;
        });
        return await authUser(data);
    }

    async function authUser(values: any): Promise<string | ErrorMessagesType[]> {
        const {routeAddress} = props;
        const routeUrl = (() => {
            switch (step) {
                case SIGN_IN: {
                    return routeAddress && routeAddress.logIn;
                }
                case SIGN_UP: {
                    return routeAddress && routeAddress.register;
                }
                case VERIFY_EMAIL: {
                    return routeAddress && routeAddress.emailVerification;
                }

            }
        })();
        const url = `${getBaseUrl()}${routeUrl}`;
        let response: ResponseType;
        if (step === VERIFY_EMAIL) {
            const token = values.verificationToken ? values.verificationToken : '';
            response = await doGetRequest(`${url}?token=${token}&email=${values.email}`, values, false);
        }
        else {
            response = await doPostRequest(url, values, false);
        }
        if (response && response[AUTH_TOKEN]) {
            switch (step) {
                case SIGN_UP: {
                    history.push(`/auth/${VERIFY_EMAIL}`);
                    break;
                }
                case SIGN_IN: {
                    history.push(`/`);
                    break;
                }
                case VERIFY_EMAIL: {
                    history.push('/');
                    break;
                }
            }
            return FORM_SUCCESSFULLY_SUBMITTED;
        }
        else if(response && response.errors && response.errors.length) {
            return response.errors
        }
        return '';
    }

    const {step} = useParams();

    return (
        <Grid container className={'auth-page'} direction={'row'} justify={'space-between'}>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                welcome
            </Grid>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                <Grid container justify={'center'}>
                    {step === SIGN_UP
                    ? <CardForm fields={getFieldConfiguration(SIGN_UP)}
                                onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                    : null}
                    {step === SIGN_IN
                        ? <CardForm fields={getFieldConfiguration(SIGN_IN)}
                                    onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                        : null}
                    {step === VERIFY_EMAIL
                        ? <CardForm fields={getFieldConfiguration(VERIFY_EMAIL)}
                                    onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                        : null}
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
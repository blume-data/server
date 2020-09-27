import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {doGetRequest, doPostRequest} from "../../../../utils/baseApi";
import {getBaseUrl} from "../../../../utils/urls";
import {RootState} from "../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {AUTH_TOKEN, clientUserType, ErrorMessagesType, USER_NAME} from "@ranjodhbirkaur/constants";
import {
    FORM_SUCCESSFULLY_SUBMITTED,
    LOGGED_IN_SUCCESSFULLY, LOGIN_TITLE,
    REGISTRATION_TITLE
} from "./constants";
import './styles.scss';
import {useHistory, useParams} from "react-router";
import {CardForm} from "./CardForm";
import {getFieldConfiguration} from "./fieldConfiguration";
import {clearAuthentication, saveAuthentication} from "./methods";
import {setAuthentication} from "./actions";
import {Alert} from "../../../../components/common/Toast";
import {AlertType} from "../../../../components/common/Form";
import { TopLink } from "./TopLink";

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ResponseType {
    errors?: ErrorMessagesType[];
    email?: string;
    id?: string;
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
}

export const AUTH_ROOT = 'auth';
export const SIGN_UP = 'register';
export const SIGN_IN = 'log-in';
export const VERIFY_EMAIL = 'verify-email';
export const SIGN_OUT = 'sign-out';

const AuthComponent = (props: PropsFromRedux) => {

    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [alert, setAlertMessage] = React.useState<AlertType>({message: ''});

    const history = useHistory();

    async function onSubmit(values: object[]) {
        let data: any = {};
        values.forEach((value: any) => {
            data[value.name] = value.value;
        });
        return await authUser(data);
    }

    async function authUser(values: any): Promise<string | ErrorMessagesType[]> {
        const {routeAddress, setAuthentication} = props;
        const routeUrl = (() => {
            let urlName = '';
            if (routeAddress) {
                
                switch (step) {
                    case SIGN_IN: {
                        urlName = routeAddress.logIn;
                        break;
                    }
                    case SIGN_UP: {
                        urlName = routeAddress.register;
                        break;
                    }
                    case VERIFY_EMAIL: {
                        urlName = routeAddress.emailVerification;
                        break;
                    }
                    case SIGN_OUT: {
                        urlName = routeAddress.logOut;
                        break;
                    }
                }
                return `${routeAddress.authRootUrl}/${clientUserType}/${urlName}`;
            }
            return '';
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
        if (step === SIGN_OUT && response) {
            setAuthentication(false);
            clearAuthentication();
            return '';
        }
        if (response && !response.errors) {
            switch (step) {
                case SIGN_UP: {
                    showAlert({message: FORM_SUCCESSFULLY_SUBMITTED});
                    history.push(`/auth/${VERIFY_EMAIL}`);
                    break;
                }
                case SIGN_IN: {
                    if (response[AUTH_TOKEN] && response[USER_NAME]) {
                        showAlert({message: LOGGED_IN_SUCCESSFULLY});
                        saveAuthentication(response);
                        setAuthentication(true);
                        history.push(`/`);
                    }
                    break;
                }
                case VERIFY_EMAIL: {
                    history.push('/dashboard/home');
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

    function showAlert(alertParam: AlertType) {
        setIsAlertOpen(true);
        setAlertMessage({
            message: alertParam.message,
            severity: alertParam.severity
        });
    }

    const {step} = useParams();

    useEffect(() => {
        if (step === SIGN_OUT && props.routeAddress && props.routeAddress.logOut) {
            authUser({});
            history.push(`/auth/${SIGN_UP}`)
        }
    },[props.routeAddress]);

    if(SIGN_OUT === step) return null;

    return (
        <Grid container className={'auth-page'} direction={'row'} justify={'space-between'}>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                welcome 
            </Grid>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                <Grid container justify={'center'}>
                    <TopLink step={step}/>
                    {step === SIGN_UP
                    ? <CardForm fields={getFieldConfiguration(SIGN_UP)}
                                onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                    : null}
                    {step === SIGN_IN
                        ? <CardForm fields={getFieldConfiguration(SIGN_IN)}
                                    onSubmit={onSubmit} title={LOGIN_TITLE} />
                        : null}
                    {step === VERIFY_EMAIL
                        ? <CardForm fields={getFieldConfiguration(VERIFY_EMAIL)}
                                    onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                        : null}
                </Grid>
            </Grid>
            <Alert
                isAlertOpen={isAlertOpen}
                onAlertClose={setIsAlertOpen}
                severity={alert.severity}
                message={alert.message} />

        </Grid>
    );
};

const mapState = (state: RootState) => ({
    routeAddress: state.routeAddress.routes.auth
});

const connector = connect(mapState, {setAuthentication});
export const Auth = connector(AuthComponent);
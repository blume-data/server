import {useEffect, useState, lazy, Suspense} from "react";
import Grid from "@material-ui/core/Grid";
import {doGetRequest, doPostRequest} from "../../../../utils/baseApi";
import {authUrl, dashboardHomeUrl, getBaseUrl} from "../../../../utils/urls";
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
import {setApplicationName, setAuthentication} from "./actions";
import {Alert} from "../../../../components/common/Toast";
import {AlertType} from "../../../../components/common/Form";
import { TopLink } from "./TopLink";
import React from "react";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {fetchApplicationNames} from "../../../dashboard/pages/home/actions";
import { PermDeviceInformationOutlined } from "@material-ui/icons";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AuthProps = PropsFromRedux & {
    location: {
        search: string
    }
}
interface ResponseType {
    errors?: ErrorMessagesType[];
    email?: string;
    id?: string;
    [AUTH_TOKEN]?: string;
    [USER_NAME]?: string;
}

export const AUTH_ROOT = authUrl;
export const SIGN_UP = 'register';
export const SIGN_IN = 'log-in';
export const VERIFY_EMAIL = 'verify-email';
export const SIGN_OUT = 'sign-out';

const AuthComponent = (props: AuthProps) => {

    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [alert, setAlertMessage] = React.useState<AlertType>({message: ''});
    const [response, setResponse] = React.useState<string | ErrorMessagesType[]>('');
    const [defaultValues, setDefaultValues] = useState<object>({});

    const history = useHistory();

    async function onSubmit(values: object[]) {
        let data: any = {};

        console.log("values", values);

        values.forEach((value: any) => {
            data[value.name] = value.value;
        });
        return await authUser(data);
    }

    function timeOut(callBack: () => void) {
        setTimeout(() => {
            callBack();
        });
    }

    /*
    * Redirect To Url
    * */
    function redirectToUrl(url: string) {
        setTimeout(() => {
            history.push(url);
        });
    }

    async function authUser(values: any) {
        const {routeAddress, setAuthentication} = props;
        //setIsLoading(true);
        // set route url according to step
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
        else if(step === SIGN_OUT) {
            const AuthToken = getItemFromLocalStorage(AUTH_TOKEN);
            if(AuthToken) {
                response = await doPostRequest(url, values, true);
            }
            else {
                response = {}
            }
        }
        else {
            response = await doPostRequest(url, values, false);
        }
        if (step === SIGN_OUT) {
            setAuthentication(false);
            clearAuthentication();
            timeOut(() => {
                history.push(`${authUrl}/${SIGN_IN}`);
            });
            setResponse('');
            return '';
        }
        if (response && !response.errors) {
            switch (step) {
                case SIGN_UP: {
                    showAlert({message: FORM_SUCCESSFULLY_SUBMITTED});
                    timeOut(() => {
                        redirectToUrl(`${authUrl}/${VERIFY_EMAIL}?email=${values.email}`);
                    });
                    break;
                }
                case SIGN_IN: {
                    if (response[AUTH_TOKEN] && response[USER_NAME]) {
                        showAlert({message: LOGGED_IN_SUCCESSFULLY});
                        saveAuthentication(response);
                        setAuthentication(true);
                        timeOut(() => {
                            redirectToUrl(dashboardHomeUrl);
                            props.fetchApplicationNames();
                        });
                    }
                    break;
                }
                case VERIFY_EMAIL: {
                    showAlert({message: LOGGED_IN_SUCCESSFULLY});
                    saveAuthentication(response);
                    setAuthentication(true);
                    timeOut(() => {
                        redirectToUrl(dashboardHomeUrl);
                    });
                    break;
                }
            }
            setResponse(FORM_SUCCESSFULLY_SUBMITTED);
        }
        else if(response && response.errors && response.errors.length) {
            setResponse(response.errors);
        }
    }

    function showAlert(alertParam: AlertType) {
        setIsAlertOpen(true);
        setAlertMessage({
            message: alertParam.message,
            severity: alertParam.severity
        });
    }

    const {step} = useParams<{step: string}>();

    useEffect(() => {
        if (step === SIGN_OUT && props.routeAddress && props.routeAddress.logOut) {
            authUser({});
            props.setApplicationName('');
        }
        if(step === VERIFY_EMAIL) {
            const urlParams = new URLSearchParams(window.location.search);
            const defaultEmail = urlParams.get('email');
            const defaultToken = urlParams.get('token');

            if(defaultEmail && defaultToken && props?.routeAddress?.emailVerification) {

                // attempt verify
                onSubmit([
                    {name: 'email', value: defaultEmail},
                    {name: 'verificationToken', value: defaultToken}
                ]);
            }

            if(defaultEmail) {
                setDefaultValues({
                    email: defaultEmail,
                    token: defaultToken ? defaultToken : ''
                });
            }

        }
    },[props.routeAddress, step]);


    if(SIGN_OUT === step) {
        return null;
    }

    return (
        <Grid container className={'auth-page'} direction={'row'} justify={'space-between'}>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                welcome
            </Grid>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                <Grid container justify={'center'}>
                    <TopLink step={step}/>
                    {step === SIGN_UP
                        ? <CardForm
                            fields={getFieldConfiguration(SIGN_UP)} response={response}
                            onSubmit={onSubmit} title={REGISTRATION_TITLE} />
                        : null}
                    {step === SIGN_IN
                        ? <CardForm
                            fields={getFieldConfiguration(SIGN_IN)} response={response}
                            onSubmit={onSubmit} title={LOGIN_TITLE} />
                        : null}
                    {step === VERIFY_EMAIL
                        ? <CardForm
                            fields={getFieldConfiguration(VERIFY_EMAIL, defaultValues)} response={response}
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

const connector = connect(mapState, {setAuthentication, setApplicationName, fetchApplicationNames});
export const Auth = connector(AuthComponent);
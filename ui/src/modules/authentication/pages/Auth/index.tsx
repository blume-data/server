import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { doGetRequest, doPostRequest } from "../../../../utils/baseApi";
import { authUrl, dashboardHomeUrl, getBaseUrl } from "../../../../utils/urls";
import { RootState } from "../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import {
  AUTH_TOKEN,
  clientUserType,
  ErrorMessagesType,
  USER_NAME,
} from "@ranjodhbirkaur/constants";
import {
  FORM_SUCCESSFULLY_SUBMITTED,
  LOGGED_IN_SUCCESSFULLY,
  LOGIN_TITLE,
  REGISTRATION_TITLE,
} from "./constants";
import "./styles.scss";
import { useHistory, useParams } from "react-router";
import { CardForm } from "./CardForm";
import { getFieldConfiguration } from "./fieldConfiguration";
import { clearAuthentication, saveAuthentication } from "./methods";
import { setApplicationName, setAuthentication } from "./actions";
import { Alert } from "../../../../components/common/Toast";
import { AlertType } from "../../../../components/common/Form";
import { TopLink } from "./TopLink";

import { getItemFromLocalStorage } from "../../../../utils/tools";
import { fetchApplicationNames } from "../../../dashboard/pages/home/actions";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AuthProps = PropsFromRedux & {
  location: {
    search: string;
  };
};
interface ResponseType {
  errors?: ErrorMessagesType[];
  email?: string;
  id?: string;
  [AUTH_TOKEN]?: string;
  [USER_NAME]?: string;
}

export const AUTH_ROOT = authUrl;
export const SIGN_UP = "register";
export const SIGN_IN = "log-in";
export const VERIFY_EMAIL = "verify-email";
export const SIGN_OUT = "sign-out";

const AuthComponent = (props: AuthProps) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [alert, setAlertMessage] = React.useState<AlertType>({ message: "" });
  const [response, setResponse] = React.useState<string | ErrorMessagesType[]>(
    ""
  );
  const [defaultValues, setDefaultValues] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  async function onSubmit(values: object[]) {
    const data: any = {};

    // console.log("values", values);

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
    const { routeAddress, setAuthentication } = props;
    // set route url according to step
    const routeUrl = (() => {
      let urlName = "";
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
      return "";
    })();
    const url = `${getBaseUrl()}${routeUrl}`;
    let response: ResponseType;
    setLoading(true);
    if (step === VERIFY_EMAIL) {
      const token = values.verificationToken ? values.verificationToken : "";
      response = await doGetRequest(
        `${url}?token=${token}&email=${values.email}`,
        values,
        false
      );
    } else if (step === SIGN_OUT) {
      const AuthToken = getItemFromLocalStorage(AUTH_TOKEN);
      if (AuthToken) {
        response = await doPostRequest(url, values, true);
      } else {
        response = {};
      }
    } else {
      response = await doPostRequest(url, values, false);
    }
    if (step === SIGN_OUT) {
      setAuthentication(false);
      clearAuthentication();
      timeOut(() => {
        history.push(`${authUrl}/${SIGN_IN}`);
      });
      setResponse("");
      return "";
    }
    setLoading(false);
    if (response && !response.errors) {
      switch (step) {
        case SIGN_UP: {
          showAlert({ message: FORM_SUCCESSFULLY_SUBMITTED });
          timeOut(() => {
            redirectToUrl(`${authUrl}/${VERIFY_EMAIL}?email=${values.email}`);
          });
          break;
        }
        case SIGN_IN: {
          if (response[AUTH_TOKEN] && response[USER_NAME]) {
            showAlert({ message: LOGGED_IN_SUCCESSFULLY });
            saveAuthentication(response);
            setAuthentication(true);

            timeOut(() => {
              props.fetchApplicationNames();
              redirectToUrl(dashboardHomeUrl);
            });
          }
          break;
        }
        case VERIFY_EMAIL: {
          showAlert({ message: LOGGED_IN_SUCCESSFULLY });
          saveAuthentication(response);
          setAuthentication(true);
          timeOut(() => {
            redirectToUrl(dashboardHomeUrl);
          });
          break;
        }
      }
      setResponse(FORM_SUCCESSFULLY_SUBMITTED);
    } else if (response && response.errors && response.errors.length) {
      setResponse(response.errors);
    }
  }

  function showAlert(alertParam: AlertType) {
    setIsAlertOpen(true);
    setAlertMessage({
      message: alertParam.message,
      severity: alertParam.severity,
    });
  }

  const { step } = useParams<{ step: string }>();

  useEffect(() => {
    setLoading(false);
    if (step === SIGN_OUT && props.routeAddress && props.routeAddress.logOut) {
      authUser({});
      props.setApplicationName("");
    } else if (step === VERIFY_EMAIL) {
      const urlParams = new URLSearchParams(window.location.search);
      const defaultEmail = urlParams.get("email");
      const defaultToken = urlParams.get("token");

      if (
        defaultEmail &&
        defaultToken &&
        props?.routeAddress?.emailVerification
      ) {
        // attempt verify
        onSubmit([
          { name: "email", value: defaultEmail },
          { name: "verificationToken", value: defaultToken },
        ]);
      }

      if (defaultEmail) {
        setDefaultValues({
          email: defaultEmail,
          token: defaultToken ? defaultToken : "",
        });
      }
    } else {
      setDefaultValues({
        email: "",
        password: "",
      });
    }
  }, [props.routeAddress, step]);

  if (SIGN_OUT === step) {
    return null;
  }

  return (
    <Grid
      container
      className={"auth-page p-10"}
      direction={"column"}
      justifyContent={"center"}
    >
      <TopLink step={step} />

      {step === SIGN_UP ? (
        <CardForm
          submitButtonName={"Create free account"}
          fields={getFieldConfiguration(SIGN_UP)}
          response={response}
          loading={loading}
          onSubmit={onSubmit}
          title={REGISTRATION_TITLE}
        />
      ) : null}
      {step === SIGN_IN ? (
        <CardForm
          submitButtonName="Login"
          fields={getFieldConfiguration(SIGN_IN)}
          response={response}
          loading={loading}
          onSubmit={onSubmit}
          title={LOGIN_TITLE}
        />
      ) : null}
      {step === VERIFY_EMAIL ? (
        <CardForm
          loading={loading}
          submitButtonName={"Verify"}
          fields={getFieldConfiguration(VERIFY_EMAIL, defaultValues)}
          response={response}
          onSubmit={onSubmit}
          title={REGISTRATION_TITLE}
        />
      ) : null}

      <Alert
        isAlertOpen={isAlertOpen}
        onAlertClose={setIsAlertOpen}
        severity={alert.severity}
        message={alert.message}
      />
    </Grid>
  );
};

const mapState = (state: RootState) => ({
  routeAddress: state.routeAddress.routes.auth,
});

const connector = connect(mapState, {
  setAuthentication,
  setApplicationName,
  fetchApplicationNames,
});
export const Auth = connector(AuthComponent);

import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { Form } from "../../../../../components/common/Form";
import {
  ConfigField,
  TEXT,
} from "../../../../../components/common/Form/interface";
import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  ErrorMessagesType,
} from "@ranjodhbirkaur/constants";
import "./create-application-name.scss";
import { doPostRequest } from "../../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../../utils/tools";
import { getBaseUrl } from "../../../../../utils/urls";
import { connect, ConnectedProps } from "react-redux";
import { fetchApplicationNames } from "../../home/actions";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface CreateApplicationNameProps extends PropsFromRedux {
  url: string;
  handleClose: (applicationName: string) => void;
}

const CreateApplicationNameComponent = (props: CreateApplicationNameProps) => {
  const { handleClose, fetchApplicationNames } = props;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | ErrorMessagesType[]>("");

  const fields: ConfigField[] = [
    {
      required: true,
      placeholder: "Application name",
      value: "",
      className: "application-name-text-field",
      type: "text",
      name: APPLICATION_NAME,
      label: "Application Name",
      inputType: TEXT,
    },
    {
      required: false,
      placeholder: "Description",
      value: "",
      className: "application-name-text-field",
      type: "text",
      name: "description",
      label: "Description",
      inputType: TEXT,
    },
  ];

  async function onSubmit(values: any[]) {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const applicationName = values[0];
    const description = values[1];

    const url = props.url
      .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : "")
      .replace(`:${APPLICATION_NAME}?`, "");

    setLoading(true);
    const resp = await doPostRequest(
      `${getBaseUrl()}${url}`,
      {
        [APPLICATION_NAME]: applicationName.value,
        description: description.value || "",
      },
      true
    );
    setLoading(false);
    if (resp && !resp.errors) {
      await fetchApplicationNames();
      handleClose(resp);
      setResponse("");
    } else {
      setResponse(resp.errors);
    }
  }

  return (
    <Grid
      container
      justify={"center"}
      className={"create-application-name-container"}
    >
      <Form
        loading={loading}
        response={response}
        className={"create-application-name-form"}
        fields={fields}
        onSubmit={onSubmit}
      />
    </Grid>
  );
};

const connector = connect(null, { fetchApplicationNames });
export const CreateApplicationName = connector(CreateApplicationNameComponent);

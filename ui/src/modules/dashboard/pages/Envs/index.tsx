import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  ErrorMessagesType
} from "@ranjodhbirkaur/constants";
import { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import BasicTableMIUI from "../../../../components/common/BasicTableMIUI";
import { Button } from "../../../../components/common/Button";
import { Form } from "../../../../components/common/Form";
import {
  ConfigField,
  TEXT,
} from "../../../../components/common/Form/interface";
import ModalDialog from "../../../../components/common/ModalDialog";
import { RootState } from "../../../../rootReducer";
import { doPostRequest, doPutRequest } from "../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../utils/tools";
import { setEnv } from "../../../../modules/authentication/pages/Auth/actions";
import { fetchApplicationNames } from "../../pages/home/actions";
import "./style.scss";

interface EnvType {
  name: string;
  description: string;
  id?: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
const Envs = (props: PropsFromRedux) => {
  const {
    applicationNames,
    applicationName,
    envUrl,
    selectedEnv,
    setEnv,
    fetchApplicationNames,
  } = props;
  const [isModelOpen, setIsModalOpen] = useState<boolean>(false);
  const [envData, setEnvData] = useState<EnvType | null>(null);
  const [response, setResponse] = useState<string | ErrorMessagesType[]>("");

  const fields: ConfigField[] = [
    {
      name: "name",
      required: true,
      placeholder: "Name",
      value: envData ? envData.name : "",
      className: "create-content-model-name",
      type: "text",
      label: "Name",
      inputType: TEXT,
      descriptionText: "name of the env",
    },
    {
      name: "description",
      required: false,
      placeholder: "Description",
      value: envData ? envData.description : "",
      className: "create-content-model-name",
      type: "text",
      label: "Description",
      inputType: TEXT,
      descriptionText: "Description of the env",
    },
  ];

  async function onCreateEnvHandler(values: any) {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const url = envUrl
      ?.replace(`:${CLIENT_USER_NAME}`, clientUserName || "")
      .replace(`:${APPLICATION_NAME}`, applicationName);

    let resp: any;

    if (envData && envData.id) {
      resp = await doPutRequest(
        url || "",
        {
          ...values,
          id: envData.id,
        },
        true
      );
    } else {
      resp = await doPostRequest(url || "", values, true);
      setEnvData(null);
    }
    if (resp && resp.errors) {
      setResponse(resp.errors);
    } else {
      setIsModalOpen(false);
      fetchApplicationNames();
    }
  }

  const env = applicationNames.find((item) => item.name === applicationName);

  const rows = env?.env.map((item: any) => {
    function onSelect() {
      setEnv(item.name);
    }
    function onClickEdit() {
      setEnvData({
        name: item.name,
        description: item.description,
        id: item.id,
      });
      setIsModalOpen(true);
    }
    item.edit = (
      <IconButton onClick={onClickEdit}>
        <EditIcon />
      </IconButton>
    );
    item.select = (
      <IconButton
        onClick={onSelect}
        className={selectedEnv === item.name ? "selected" : ""}
      >
        <LinkIcon />
      </IconButton>
    );
    return item;
  });

  if (env)
    return (
      <Grid className="env-container">
        <Button name="Create Env" onClick={() => setIsModalOpen(true)} />
        <BasicTableMIUI
          tableName="Envs"
          rows={rows || []}
          columns={[
            { name: "Name", value: "name" },
            { name: "Description", value: "description" },
            { name: "Edit", value: "edit", align: "center" },
            { name: "Select", value: "select", align: "center" },
          ]}
        />

        <ModalDialog
          title="Create or update env"
          isOpen={isModelOpen}
          handleClose={() => setIsModalOpen(!isModelOpen)}
          children={
            <Form
              fields={fields}
              className=""
              onSubmit={onCreateEnvHandler}
              response={response}
              getValuesAsObject={true}
            />
          }
        />
      </Grid>
    );
  return null;
};

const mapState = (state: RootState) => {
  return {
    env: state.authentication.env,
    language: state.authentication.language,
    applicationName: state.authentication.applicationName,
    applicationNames: state.authentication.applicationsNames,
    envUrl: state.routeAddress.routes.auth?.envUrl,
    selectedEnv: state.authentication.env,
  };
};

const connector = connect(mapState, { setEnv, fetchApplicationNames });
export default connector(Envs);

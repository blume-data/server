import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { ConfigField, TEXT } from "../../../components/common/Form/interface";
import {
  DESCRIPTION,
  DISPLAY_NAME,
  ErrorMessagesType,
  NAME,
} from "@ranjodhbirkaur/constants";
import { Form } from "../../../components/common/Form";

export const UpdateAsset = () => {
  const [description, setDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [response, setResponse] = useState<string | ErrorMessagesType[]>("");

  const nameFields: ConfigField[] = [
    {
      required: true,
      placeholder: "File name",
      value: fileName,
      className: "create-content-model-name",
      type: "text",
      name: "File name",
      label: "File name",
      inputType: TEXT,
      descriptionText: "Name of the file",
    },
    {
      required: false,
      placeholder: "Description",
      value: description,
      className: "create-content-model-description",
      type: "text",
      name: DESCRIPTION,
      label: "Description",
      inputType: TEXT,
      descriptionText: "Description of the model",
    },
  ];

  function onSubmit(values: any) {
    console.log("update asset values", values);
  }

  return (
    <Grid className="update-asset-wrapper">
      <Form
        response={response}
        className={"update-asset-form-container"}
        fields={nameFields}
        onSubmit={onSubmit}
      />
    </Grid>
  );
};

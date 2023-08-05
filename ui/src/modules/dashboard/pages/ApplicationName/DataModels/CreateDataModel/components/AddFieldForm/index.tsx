import { Grid, Button } from "@mui/material";
import { Form } from "../../../../../../../../components/common/Form";
import {
  FIELD_NAME_GROUP,
  FIELD_LIMIT_CHARACTER_COUNT_GROUP,
  FIELD_LIMIT_VALUE_GROUP,
  FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
  FIELD_DEFAULT_VALUE_GROUP,
  FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
  FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
  FIELD_REFERENCE_MODEL_GROUP,
} from "../../constants";
import { ConfigField } from "../../../../../../../../components/common/Form/interface";
import { useAppState } from "../../AppContext";

interface AddFieldFormType {
  closeAddFieldForm(): void;
  onSubmitFieldProperty(values: any): void;
  fields: ConfigField[];
}

export function AddFieldForm(props: AddFieldFormType) {
  const { closeAddFieldForm, onSubmitFieldProperty, fields } = props;
  const { formResponse } = useAppState();

  return (
    <Grid
      container
      direction={"column"}
      className={"set-fields-property-container"}
    >
      <Grid
        item
        style={{ display: "none" }}
        className={"cancel-button-container"}
      >
        <Button
          variant={"outlined"}
          name={"Cancel"}
          color={"primary"}
          onClick={closeAddFieldForm}
        />
      </Grid>
      <Grid item={true}>
        <Form
          groups={[
            FIELD_NAME_GROUP,
            FIELD_LIMIT_CHARACTER_COUNT_GROUP,
            FIELD_LIMIT_VALUE_GROUP,
            FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
            FIELD_DEFAULT_VALUE_GROUP,
            FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
            FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
            FIELD_REFERENCE_MODEL_GROUP,
          ]}
          response={formResponse}
          submitButtonName={"Save field"}
          onSubmit={onSubmitFieldProperty}
          fields={fields}
          className={"field-property-form"}
        />
      </Grid>
    </Grid>
  );
}

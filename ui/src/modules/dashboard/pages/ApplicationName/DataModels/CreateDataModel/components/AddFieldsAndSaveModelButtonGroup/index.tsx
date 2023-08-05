import { Grid } from "@mui/material";
import { useAppState } from "../../AppContext";
import { Button } from "../../../../../../../../components/common/Button";

export function AddFieldsAndSaveModelButtonGroup(props: {
  env: string;
  applicationName: string;
}) {
  const {
    contentModelData,
    properties,
    onClickSaveDataModel,
    onClickAddFields,
  } = useAppState();

  const { env, applicationName } = props;

  if (contentModelData.displayName) {
    return (
      <Grid
        container={true}
        justifyContent={"flex-end"}
        className={"modal-action-buttons"}
      >
        <Button
          name={"Add Fields"}
          onClick={onClickAddFields}
          color={"secondary"}
          variant={"contained"}
        />
        {properties && properties.length ? (
          <Button
            name={"Save Model"}
            className={"save-model"}
            onClick={() =>
              onClickSaveDataModel(
                contentModelData,
                properties,
                env,
                applicationName
              )
            }
            color={"primary"}
            variant={"contained"}
          />
        ) : null}
      </Grid>
    );
  }
  return null;
}

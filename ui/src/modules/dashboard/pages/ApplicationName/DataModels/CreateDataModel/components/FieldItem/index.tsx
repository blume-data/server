import Tooltip from "@mui/material/Tooltip";
import { useAppState } from "../../AppContext";
import Paper from "@mui/material/Paper";
import { Button } from "../../../../../../../../components/common/Button";
import Grid from "@mui/material/Grid";

export function FieldItem(props: {
  name: string;
  description: string;
  Icon: JSX.Element;
  value: string;
}) {
  const { setFieldData, setAddingField, setSettingFieldName, fieldData } =
    useAppState();

  const { name, description, Icon, value } = props;

  function onClick() {
    setFieldData({
      ...fieldData,
      fieldType: value,
    });
    setAddingField(false);
    setSettingFieldName(true);
  }

  return (
    <Tooltip title={description}>
      <Paper onClick={onClick} className="paper-field-item">
        <Grid className={"field-item"}>
          <Button>
            {Icon}
            <h2>{name}</h2>
            <p>{description}</p>
          </Button>
        </Grid>
      </Paper>
    </Tooltip>
  );
}

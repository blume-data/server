import Grid from "@mui/material/Grid";
import { useAppState } from "../../AppContext";
import { RenderHeading } from "../../../../../../../../components/common/RenderHeading";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { DropDown } from "../../../../../../../../components/common/Form/DropDown";

// TODO:  Need to move out
export function NameSection() {
  const {
    setSettingFieldName,
    setAddingField,
    setHideNames,
    contentModelData,
    properties,
    setContentModelData,
  } = useAppState();

  function onClick() {
    // turn off fields
    // turn off setting fields property
    // open name form
    setSettingFieldName(false);
    setAddingField(false);
    setHideNames(false);
  }

  // console.log("contentModelData", fieldData);

  return (
    <Grid
      container={true}
      direction="column"
      className="name-section-container"
    >
      <Grid item={true}>
        <Grid container={true}>
          <Grid item={true} className={"text-container"}>
            <RenderHeading
              type={"primary"}
              className={"model-display-name m-0"}
              value={`${
                contentModelData.displayName
                  ? contentModelData.displayName
                  : "untitled model"
              }`}
            />
            {contentModelData.description ? (
              <RenderHeading
                type={"secondary"}
                className={"model-description"}
                value={contentModelData.description}
              />
            ) : null}
          </Grid>
          <Grid item={true} className={"edit-button"}>
            <Tooltip title={`Edit model ${contentModelData.displayName}`}>
              <IconButton onClick={onClick} color="primary" size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item={true}>
        <Grid container={true} className="title-container" direction="column">
          <Grid item={true}>
            <RenderHeading type="secondary" value="Set a title field" />
          </Grid>

          <Grid item={true}>
            <DropDown
              options={
                properties?.map((property) => {
                  return {
                    label: property.displayName,
                    value: property.name,
                  };
                }) || []
              }
              name="title field"
              placeholder="title field"
              required={false}
              onChange={(e) => {
                setContentModelData({
                  ...contentModelData,
                  titleProperty: e.target.value,
                });
              }}
              value={contentModelData.titleProperty}
              label="title field"
              className="title-drop-down"
              descriptionText="title property of the model, if left blank first property will be set as title property"
              index={9}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

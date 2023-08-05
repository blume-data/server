import { Paper, Grid } from "@mui/material";
import {
  DISPLAY_NAME,
  DESCRIPTION,
  RuleType,
  BOOLEAN_FIElD_TYPE,
  MEDIA_FIELD_TYPE,
  SHORT_STRING_FIElD_TYPE,
  INTEGER_FIElD_TYPE,
  FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
  FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
  FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
} from "@ranjodhbirkaur/constants";
import BasicTableMIUI from "../../../../../../../../components/common/BasicTableMIUI";
import { RenderHeading } from "../../../../../../../../components/common/RenderHeading";
import { useAppState } from "../../AppContext";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export function PropertiesSection() {
  const {
    setDeleteEntryName,
    setConfirmDialogOpen,
    setSettingFieldName,
    setAddingField,
    setFieldData,
    setFieldEditMode,
    properties,
    addingField,
  } = useAppState();

  const tableRows: any = [
    { name: "Name", value: DISPLAY_NAME },
    { name: "Description", value: DESCRIPTION },
    { name: "Type", value: "type" },
    { name: "Edit", value: "edit", onClick: true, align: "center" },
    { name: "Delete", value: "delete", onClick: true, align: "center" },
  ];

  function openConfirmAlert(property: RuleType) {
    setDeleteEntryName(property.name);
    setConfirmDialogOpen(true);
  }

  function onClickEdit(property: RuleType) {
    setTimeout(() => {
      setSettingFieldName(true);
      setAddingField(false);
      setFieldEditMode(true);
      setFieldData({
        fieldType: property.type,
        fieldDisplayName: property.displayName,
        fieldName: property.name,
        fieldDescription: property.description,
        fieldIsRequired: property.required ? "true" : "false",
        fieldIsUnique: property.unique ? "true" : "false",
        fieldDefaultValue: (() => {
          if (property.type === BOOLEAN_FIElD_TYPE) {
            return property.default === "true" ? "true" : "false";
          } else {
            return property.default || "";
          }
        })(),
        fieldAssetsType: (() => {
          if (property.type === MEDIA_FIELD_TYPE) {
            return property.assetsType || "";
          }
        })(),
        fieldMax: (() => {
          if (
            property.type === SHORT_STRING_FIElD_TYPE ||
            property.type === INTEGER_FIElD_TYPE
          ) {
            return property.max || "";
          }
        })(),
        fieldMin: (() => {
          if (
            property.type === SHORT_STRING_FIElD_TYPE ||
            property.type === INTEGER_FIElD_TYPE
          ) {
            return property.min || "";
          }
        })(),
        fieldMinMaxCustomErrorMessage: (() => {
          if (
            property.type === SHORT_STRING_FIElD_TYPE ||
            property.type === INTEGER_FIElD_TYPE
          ) {
            return property[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] || "";
          }
        })(),
        fieldOnlySpecifiedValues: (() => {
          if (
            property.type === SHORT_STRING_FIElD_TYPE ||
            property.type === INTEGER_FIElD_TYPE
          ) {
            return property.onlyAllowedValues || "";
          }
        })(),
        fieldMatchPattern: (() => {
          if (property.type === SHORT_STRING_FIElD_TYPE) {
            return property.matchSpecificPattern || "";
          }
        })(),
        fieldMatchCustomPattern: (() => {
          if (property.type === SHORT_STRING_FIElD_TYPE) {
            return property.matchCustomSpecificPattern || "";
          }
        })(),
        fieldProhibitPattern: (() => {
          if (property.type === SHORT_STRING_FIElD_TYPE) {
            return property.prohibitSpecificPattern || "";
          }
        })(),
        fieldMatchPatternCustomError: (() => {
          if (property.type === SHORT_STRING_FIElD_TYPE) {
            return (
              property[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN] || ""
            );
          }
        })(),
        fieldProhibitPatternCustomError: (() => {
          if (property.type === SHORT_STRING_FIElD_TYPE) {
            return (
              property[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN] || ""
            );
          }
        })(),
      });
    });
  }

  const rows =
    properties &&
    properties.map((property) => {
      return {
        ...property,
        edit: (
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
        ),
        delete: (
          <IconButton>
            <DeleteIcon color="secondary" />
          </IconButton>
        ),
        "delete-click": () => openConfirmAlert(property),
        "edit-click": () => onClickEdit(property),
      };
    });

  return (
    <Paper elevation={6}>
      <Grid
        container
        direction={"column"}
        className={"property-section-container"}
      >
        {properties && properties.length ? (
          <BasicTableMIUI
            rows={rows}
            columns={tableRows}
            tableName={"Fields"}
          />
        ) : addingField ? null : (
          <RenderHeading
            className={"no-fields-added"}
            type={"primary"}
            value={"Add some fields to get stated"}
          />
        )}
      </Grid>
    </Paper>
  );
}

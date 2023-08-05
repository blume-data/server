import { useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import { Form } from "../../../../../../components/common/Form";
import { ConfigField } from "../../../../../../components/common/Form/interface";
import {
  BOOLEAN_FIElD_TYPE,
  CLIENT_USER_NAME,
  DATE_FIElD_TYPE,
  DESCRIPTION,
  DISPLAY_NAME,
  FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
  FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
  FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
  FIELD_MAX,
  FIELD_MIN,
  INTEGER_FIElD_TYPE,
  IS_FIELD_REQUIRED,
  IS_FIELD_UNIQUE,
  JSON_FIELD_TYPE,
  LOCATION_FIELD_TYPE,
  LONG_STRING_FIELD_TYPE,
  MEDIA_FIELD_TYPE,
  NAME,
  REFERENCE_FIELD_TYPE,
  SHORT_STRING_FIElD_TYPE,
  trimCharactersAndNumbers,
  APPLICATION_NAME,
  DATE_AND_TIME_FIElD_TYPE,
  RuleType,
  FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN,
} from "@ranjodhbirkaur/constants";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import "./style.scss";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks5Icon from "@mui/icons-material/Looks5";
import Looks4Icon from "@mui/icons-material/Looks4";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LinkIcon from "@mui/icons-material/Link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { RootState } from "../../../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import { doGetRequest } from "../../../../../../utils/baseApi";
import {
  getItemFromLocalStorage,
  getModelDataAndRules,
  getUrlSearchParams,
} from "../../../../../../utils/tools";
import {
  dashboardCreateDataModelsUrl,
  dashboardDataModelsUrl,
  getBaseUrl,
} from "../../../../../../utils/urls";
import Loader from "../../../../../../components/common/Loader";
import IconButton from "@mui/material/IconButton";
import { Alert } from "../../../../../../components/common/Toast";
import { AlertDialog } from "../../../../../../components/common/AlertDialog";
import { useHistory } from "react-router";
import ModalDialog from "../../../../../../components/common/ModalDialog";
import { RenderHeading } from "../../../../../../components/common/RenderHeading";
import { Button } from "../../../../../../components/common/Button";
import {
  FIELD_ONLY_SPECIFIED_VALUES,
  FIELD_NAME,
  FIELD_ID,
  FIELD_DESCRIPTION,
  FIELD_ASSET_TYPE,
  FIELD_DEFAULT_VALUE,
  FIELD_PROHIBIT_SPECIFIC_PATTERN,
  FIELD_MATCH_SPECIFIC_PATTERN_STRING,
  FIELD_MATCH_SPECIFIC_PATTERN,
  FIELD_REFERENCE_MODEL_TYPE,
  FIELD_REFERENCE_MODEL_NAME,
} from "./constants";
import { getNameFields, getPropertyFields } from "./fields";
import { ModelSetting } from "./ModelSetting";
import { DATA_ROUTES, paletteColor } from "../../../../../../utils/constants";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ApplicationName from "../..";
import { useAppState, withAppState } from "./AppContext";
import { AddFieldsAndSaveModelButtonGroup } from "./components/AddFieldsAndSaveModelButtonGroup";
import { FieldItem } from "./components/FieldItem";
import { NameSection } from "./components/NameSection";
import { PropertiesSection } from "./components/PropertiesSection";
import { AddFieldForm } from "./components/AddFieldForm";

const CreateDataModelComponent = (props: CreateDataModelType) => {
  const [modelNames, setModelNames] = useState<
    { label: string; value: string }[]
  >([]);

  const { env, applicationName, language } = props;

  const history = useHistory();

  const GetCollectionNamesUrl = DATA_ROUTES.GetCollectionNamesUrl;

  const {
    addingField,
    setAddingField,
    hideNames,
    setHideNames,
    contentModelData,
    setContentModelData,
    properties,
    setProperties,
    formResponse,
    setFormResponse,
    isAlertOpen,
    setIsAlertOpen,
    alert,
    setAlertMessage,
    modelSetting,
    setModelSetting,
    onClickSaveDataModel,
    fieldData,
    setFieldData,
    settingFieldName,
    setSettingFieldName,
    isLoading,
    setIsLoading,
    confirmDialogOpen,
    deleteEntryName,
    setDeleteEntryName,
    setConfirmDialogOpen,
    fieldEditMode,
    setFieldEditMode,
  } = useAppState();

  const {
    fieldName = "",
    fieldDisplayName = "",
    fieldMatchPattern = "",
    fieldMatchCustomPattern = "",
    fieldProhibitPattern = "",
    fieldMax = "",
    fieldMinMaxCustomErrorMessage = "",
    fieldMin = "",
    fieldAssetsType = "",
    fieldType = "",
    fieldDefaultValue = "",
    fieldDescription = "",
    fieldIsRequired = "",
    fieldIsUnique = "",
    fieldMatchPatternCustomError = "",
    fieldProhibitPatternCustomError = "",
    fieldOnlySpecifiedValues = "",
  } = fieldData;

  async function getData() {
    setIsLoading(true);
    const response = await getModelDataAndRules({
      modelName: contentModelData.name,
      applicationName,
      env,
      language,
      GetCollectionNamesUrl,
      getOnly: "name,description,rules,displayName,titleField",
    });

    if (response && !response.errors && response.length) {
      if (response[0].id && response[0].name) {
        const hasUrlParam = getUrlSearchParams("name");
        if (!hasUrlParam) {
          history.push(
            `${dashboardCreateDataModelsUrl}?name=${response[0].name}`
          );
        }
      }
      setProperties(JSON.parse(response[0].rules));

      setContentModelData({
        ...contentModelData,
        displayName: response[0].displayName,
        description: response[0].description,
        id: response[0].id,
        titleProperty: response[0].titleField,
      });

      if (response[0].setting) {
        let supportedDomains = [];

        try {
          supportedDomains = JSON.parse(
            response[0].setting?.supportedDomains || "[]"
          );
          if (!supportedDomains) {
            supportedDomains = [];
          }
        } catch (e) {
          supportedDomains = [];
        }

        setModelSetting({
          id: response[0].setting.id,
          isPublic: response[0].setting.isPublic,
          supportedDomains,
          getRestrictedUserGroups: response[0].setting.getRestrictedUserGroups,
          postRestrictedUserGroups:
            response[0].setting.postRestrictedUserGroups,
          putRestrictedUserGroups: response[0].setting.putRestrictedUserGroups,
          deleteRestrictedUserGroups:
            response[0].setting.deleteRestrictedUserGroups,

          getPermittedUserGroups: response[0].setting.getPermittedUserGroups,
          postPermittedUserGroups: response[0].setting.postPermittedUserGroups,
          putPermittedUserGroups: response[0].setting.putPermittedUserGroups,
          deletePermittedUserGroups:
            response[0].setting.deletePermittedUserGroups,
        });
      }
    }
    setIsLoading(false);
  }

  async function getCollectionNames() {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    if (GetCollectionNamesUrl && applicationName) {
      const url = GetCollectionNamesUrl.replace(
        `:${CLIENT_USER_NAME}`,
        clientUserName ? clientUserName : ""
      )
        .replace(":env", env)
        .replace(":language", language)
        .replace(`:${APPLICATION_NAME}`, applicationName);

      const fullUrl = `${getBaseUrl()}${url}?get=displayName,name`;
      const response = await doGetRequest(fullUrl, null, true);

      if (response && response.length) {
        const m: { label: string; value: string }[] = [];
        response.forEach((item: { displayName: string; name: string }) => {
          if (item.name !== contentModelData.name) {
            m.push({
              label: item.displayName,
              value: item.name,
            });
          }
        });
        setModelNames(m);
      }
    }
  }

  useEffect(() => {
    if (contentModelData.name && applicationName) {
      getCollectionNames();
      getData();
    }
  }, [applicationName, contentModelData.name]);

  // set model name from query string url
  useEffect(() => {
    const Name = getUrlSearchParams("name");
    if (Name) {
      setContentModelData({
        ...contentModelData,
        name: Name,
      });

      setFieldEditMode(true);
    }
  }, []);

  const nameFields: ConfigField[] = getNameFields({
    contentModelDisplayName: contentModelData.displayName,
    contentModelDescription: contentModelData.description,
    contentModelName: contentModelData.name,
  });

  const propertyNameFields = getPropertyFields({
    modelNames,
    fieldAssetsType,
    fieldName,
    fieldDisplayName,
    fieldType,
    fieldDescription,
    fieldDefaultValue,
    fieldEditMode,
    fieldMax,
    fieldMin,
    fieldIsRequired,
    fieldIsUnique,
    fieldMatchCustomPattern,
    fieldMatchPattern,
    fieldMatchPatternCustomError,
    fieldProhibitPattern,
    fieldMinMaxCustomErrorMessage,
    fieldProhibitPatternCustomError,
    fieldOnlySpecifiedValues,
  });

  function onSubmitCreateContentModel(values: object[]) {
    let name = "";
    let displayName = "";
    let description = "";

    values.forEach((value: any) => {
      if (value.name === NAME) {
        name = trimCharactersAndNumbers(value.value);
      } else if (value.name === DISPLAY_NAME) {
        displayName = value.value;
      } else if (value.name === DESCRIPTION) {
        description = value.value;
      }
    });

    const contentModelName = name || trimCharactersAndNumbers(displayName);

    if (contentModelName) {
      setHideNames(true);

      const newData = {
        ...contentModelData,
        name: contentModelName,
        description: description,
        displayName: displayName,
      };

      setContentModelData(newData);

      if (!properties) {
        // Save model properties
        const newProperties = [
          {
            name: "title",
            type: SHORT_STRING_FIElD_TYPE,
            required: false,
            unique: false,
            displayName: "Example title field",
            description:
              "A default title field created by default in every model",
          },
        ];
        setProperties(newProperties);
      }
      onClickSaveDataModel(newData, properties || [], env, applicationName);
    } else {
      // show alert that model name is required
      showAlert("Please add Model name");
    }
  }

  function onSubmitFieldProperty(values: any) {
    if (values && values.length) {
      let propertyId = "";
      let propertyName = "";
      let propertyIsRequired = "";
      let propertyDescription = "";
      let propertyMax = 0;
      let propertyMin = 0;
      let propertyMinMaxCustomErrorMessage = "";
      let propertyIsUnique = "";
      // let propertyIsIndexable = "";

      let propertyMatchPattern = "";
      let propertyMatchPatternError = "";

      let propertyMatchCustomPatternErrorMessage = "";

      let propertyProhibitPattern = "";
      let propertyProhibitPatternError = "";

      let propertyMatchPatternString = "";
      let propertyOnlySpecifiedValues = "";
      let propertyDefaultValue = "";
      let propertyReferenceModelName = "";
      let propertyReferenceModelType = "";
      let propertyMediaType = "";
      values.forEach((value: any) => {
        const v = value.value;
        switch (value.name) {
          case FIELD_ASSET_TYPE: {
            propertyMediaType = v;
            break;
          }
          case FIELD_DEFAULT_VALUE: {
            propertyDefaultValue = v;
            break;
          }
          case FIELD_ONLY_SPECIFIED_VALUES: {
            propertyOnlySpecifiedValues = v;
            break;
          }
          case FIELD_PROHIBIT_SPECIFIC_PATTERN: {
            propertyProhibitPattern = v;
            break;
          }
          case FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN: {
            propertyMatchPatternError = v;
            break;
          }
          case FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN: {
            propertyMatchCustomPatternErrorMessage = v;
            break;
          }
          case FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN: {
            propertyProhibitPatternError = v;
            break;
          }
          case FIELD_MATCH_SPECIFIC_PATTERN: {
            propertyMatchPattern = v;
            break;
          }
          case FIELD_MATCH_SPECIFIC_PATTERN_STRING: {
            propertyMatchPatternString = v;
            break;
          }
          case FIELD_ID: {
            propertyId = fieldEditMode ? v : trimCharactersAndNumbers(v);
            break;
          }
          case FIELD_NAME: {
            propertyName = v;
            break;
          }
          case IS_FIELD_REQUIRED: {
            propertyIsRequired = v;
            break;
          }

          case FIELD_DESCRIPTION: {
            propertyDescription = v;
            break;
          }
          case FIELD_MAX: {
            propertyMax = v;
            break;
          }
          case FIELD_MIN: {
            propertyMin = v;
            break;
          }
          case FIELD_CUSTOM_ERROR_MSG_MIN_MAX: {
            propertyMinMaxCustomErrorMessage = v;
            break;
          }
          // case "indexable": {
          //   propertyIsIndexable = v;
          //   break;
          // }
          case IS_FIELD_UNIQUE: {
            propertyIsUnique = v;
            break;
          }
          case FIELD_REFERENCE_MODEL_NAME: {
            propertyReferenceModelName = v;
            break;
          }
          case FIELD_REFERENCE_MODEL_TYPE: {
            propertyReferenceModelType = v;
            break;
          }
        }
      });

      let isValid = true;
      const errors: { message: string }[] = [];

      /*
       * If field type is reference
       * check if the reference model name and reference model type is present
       * */
      if (fieldType === REFERENCE_FIELD_TYPE) {
        if (!propertyReferenceModelName) {
          errors.push({
            message: "Please add reference model name",
          });
          isValid = false;
        }
        if (!propertyReferenceModelType) {
          errors.push({
            message: "Please add reference model type",
          });
          isValid = false;
        }
      }

      if (isValid) {
        setTimeout(() => {
          const property: RuleType = {
            name: propertyId || trimCharactersAndNumbers(propertyName),
            displayName: propertyName,
            required: propertyIsRequired === "true",
            type: fieldType,
            description: propertyDescription,
            [IS_FIELD_UNIQUE]: propertyIsUnique === "true",

            default: propertyDefaultValue ? propertyDefaultValue : undefined,

            matchSpecificPattern: propertyMatchPattern
              ? propertyMatchPattern
              : undefined,
            [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]:
              propertyMatchPatternError ? propertyMatchPatternError : undefined,

            prohibitSpecificPattern: propertyProhibitPattern
              ? propertyProhibitPattern
              : undefined,
            [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]:
              propertyProhibitPatternError
                ? propertyProhibitPatternError
                : undefined,

            [FIELD_MIN]: propertyMin ? propertyMin : undefined,
            [FIELD_MAX]: propertyMax ? propertyMax : undefined,
            [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: propertyMinMaxCustomErrorMessage
              ? propertyMinMaxCustomErrorMessage
              : undefined,

            onlyAllowedValues: propertyOnlySpecifiedValues
              ? propertyOnlySpecifiedValues
              : undefined,

            matchCustomSpecificPattern: propertyMatchPatternString
              ? propertyMatchPatternString
              : undefined,
            [FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN]:
              propertyMatchCustomPatternErrorMessage
                ? propertyMatchCustomPatternErrorMessage
                : undefined,

            referenceModelName: propertyReferenceModelName
              ? propertyReferenceModelName
              : undefined,
            referenceModelType: propertyReferenceModelType
              ? propertyReferenceModelType
              : undefined,

            assetsType: propertyMediaType ? propertyMediaType : undefined,
          };

          const tempProperties = JSON.parse(
            JSON.stringify(properties ? properties : [])
          );
          const exist = tempProperties.find(
            (item: any) => item.name === property.name
          );

          if (exist) {
            const newProperties: RuleType[] = tempProperties.map(
              (propertyItem: RuleType) => {
                if (property.name === propertyItem.name) {
                  return property;
                } else {
                  return propertyItem;
                }
              }
            );
            setProperties(newProperties);
          } else {
            tempProperties.push(property);
            setProperties(tempProperties);
          }

          closeAddFieldForm();
        });
      } else {
        setFormResponse(errors);
      }
    }
  }

  /*Show message alert* */
  function showAlert(message: string, severity?: "error" | "success" | "info") {
    if (!severity) {
      severity = "error";
    }
    setTimeout(() => {
      setIsAlertOpen(true);
      setAlertMessage({
        message,
        severity,
      });
    }, 10);
  }

  /*Handle click on cancel add field*/
  function onClickCancelAddField() {
    setAddingField(false);
  }

  function onClickDeleteProperty(propertyName: string) {
    if (properties) {
      const tempProperties = properties.filter((propertyItem) => {
        return propertyItem.name !== propertyName;
      });
      setProperties(tempProperties);
    }
  }

  /*Close the form of fields properties*/
  function closeAddFieldForm() {
    setFieldData({});
    setFieldEditMode(false);
    setSettingFieldName(false);
  }

  // When settings is created save the model
  useEffect(() => {
    if (modelSetting.id) {
      onClickSaveDataModel(
        contentModelData,
        properties || [],
        env,
        applicationName
      );
    }
  }, [modelSetting.id]);

  return (
    <Grid container={true} className={"create-data-model-container"}>
      {isLoading ? <Loader /> : null}

      {/* Top Section */}
      {/* Content Model data, addingField, settingFieldName */}
      <Grid item={true} className="left-container">
        <Grid
          style={{ flexWrap: "nowrap" }}
          container
          className={"model-name-container"}
          justifyContent="space-between"
        >
          <Grid item={true}>
            <NameSection />
          </Grid>
          <Grid item={true} className="round-padding">
            <Tooltip title="Close">
              <IconButton
                onClick={() =>
                  history.push(
                    `${dashboardDataModelsUrl}`.replace(
                      `:${ApplicationName}`,
                      applicationName
                    )
                  )
                }
                style={{
                  backgroundColor: paletteColor.primary.main,
                  color: "white",
                }}
                size="medium"
              >
                <CloseOutlined></CloseOutlined>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container={true} className="create-model-container">
          <Grid item={true} className="create-content-model">
            <Grid>
              {contentModelData.displayName ? (
                <PropertiesSection />
              ) : (
                <RenderHeading
                  className={"add-name-heading"}
                  value={"Please add name of the model"}
                  type={"secondary"}
                />
              )}
            </Grid>

            {addingField ? (
              <Grid container={true} className="fields-container">
                <Grid container={true} justifyContent={"space-between"}>
                  <Grid item={true}>
                    <RenderHeading
                      className="field-heading-container"
                      type={"primary"}
                      value={"Add new field"}
                    />
                  </Grid>
                  <Grid item={true}>
                    <Grid
                      container={true}
                      justifyContent={"center"}
                      direction={"column"}
                    >
                      <Button
                        className={"cancel-button"}
                        variant={"outlined"}
                        name={"Cancel"}
                        color={"primary"}
                        onClick={onClickCancelAddField}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  spacing={1}
                  container
                  justifyContent={"center"}
                  className="fields-grid"
                >
                  <FieldItem
                    value={LONG_STRING_FIELD_TYPE}
                    name="Formatted Text"
                    description="customised text with links and media"
                    Icon={<TextFieldsIcon />}
                  />
                  <FieldItem
                    value={SHORT_STRING_FIElD_TYPE}
                    name="Text"
                    description="names, paragraphs, title"
                    Icon={<TextFieldsIcon />}
                  />
                  <FieldItem
                    value={INTEGER_FIElD_TYPE}
                    name="Number"
                    description="numbers like age, count, quantity"
                    Icon={
                      <Grid className={"numbers"}>
                        <Looks3Icon />
                        <Looks4Icon />
                        <Looks5Icon />
                      </Grid>
                    }
                  />
                  <FieldItem
                    value={DATE_FIElD_TYPE}
                    name="Date"
                    description="only date, years, months, days"
                    Icon={<DateRangeIcon />}
                  />
                  <FieldItem
                    value={DATE_AND_TIME_FIElD_TYPE}
                    name="Date and time"
                    description="date with time, days, hours, events"
                    Icon={<AccessTimeIcon />}
                  />
                  <FieldItem
                    value={LOCATION_FIELD_TYPE}
                    name="Location"
                    description="coordinates"
                    Icon={<LocationOnIcon />}
                  />
                  <FieldItem
                    value={BOOLEAN_FIElD_TYPE}
                    name="Boolean"
                    description="true or false"
                    Icon={<ToggleOffIcon />}
                  />
                  <FieldItem
                    value={JSON_FIELD_TYPE}
                    name="Json"
                    description="json data"
                    Icon={<CodeIcon />}
                  />
                  <FieldItem
                    value={MEDIA_FIELD_TYPE}
                    name="Media"
                    description="videos, photos, files"
                    Icon={<PermMediaIcon />}
                  />
                  <FieldItem
                    value={REFERENCE_FIELD_TYPE}
                    name="Reference"
                    description="For example a comment can refer to authors"
                    Icon={<LinkIcon />}
                  />
                </Grid>
              </Grid>
            ) : settingFieldName ? null : (
              <AddFieldsAndSaveModelButtonGroup
                env={env}
                applicationName={applicationName}
              />
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* MODAL SETTING CONTAINER */}
      {/* properties, modelSetting, setModelSetting, isLoading */}
      {properties && properties.length ? (
        <Grid item={true} className="right-container">
          <div>
            <RenderHeading
              className={"main-heading"}
              type={"main"}
              value={`Settings`}
            />
            <ModelSetting
              data={modelSetting}
              env={env}
              setSetting={setModelSetting}
              applicationName={applicationName}
              isLoading={isLoading}
            />
          </div>
        </Grid>
      ) : null}

      {/*confirmDialogOpen, deleteEntryName  */}
      <AlertDialog
        onClose={() => {
          setConfirmDialogOpen(false);
          setDeleteEntryName("");
        }}
        open={confirmDialogOpen}
        onConfirm={() => {
          onClickDeleteProperty(deleteEntryName);
          setDeleteEntryName("");
          setConfirmDialogOpen(false);
        }}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setDeleteEntryName("");
        }}
        title={"Confirm Delete"}
        subTitle={"Please confirm if you want to delete"}
      />

      {/* isAlertOpen, alert */}
      <Alert
        isAlertOpen={isAlertOpen}
        onAlertClose={setIsAlertOpen}
        severity={alert.severity}
        message={alert.message}
      />

      {/* fieldEditMode, contentModelData, hideNames, formResponse, nameFields, onSubmitCreateCOntentModel  */}
      <ModalDialog
        title={`${
          fieldEditMode || contentModelData.id ? "Edit" : "Create new"
        } Model`}
        isOpen={!hideNames}
        handleClose={() => setHideNames(true)}
      >
        <Form
          response={formResponse}
          submitButtonName={"Save model name"}
          className={"create-content-model-form"}
          fields={nameFields}
          showClearButton={true}
          onSubmit={onSubmitCreateContentModel}
        />
      </ModalDialog>

      {/* settingFieldName, closeAddFieldForm, onSubmitFieldProperty, propertyNameFields
       */}
      <ModalDialog
        title={`Field`}
        isOpen={!!settingFieldName}
        handleClose={closeAddFieldForm}
      >
        <AddFieldForm
          closeAddFieldForm={closeAddFieldForm}
          onSubmitFieldProperty={onSubmitFieldProperty}
          fields={propertyNameFields()}
        />
      </ModalDialog>
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    env: state.authentication.env,
    applicationName: state.authentication.applicationName,
    language: state.authentication.language,
  };
};
const connector = connect(mapState);
export const CreateDataModel = connector(
  withAppState(CreateDataModelComponent)
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateDataModelType = PropsFromRedux;

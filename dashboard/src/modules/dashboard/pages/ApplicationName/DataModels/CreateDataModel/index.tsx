import React, { useEffect, useState } from "react";
import { Grid, Tooltip } from "@material-ui/core";
import { AlertType, Form } from "../../../../../../components/common/Form";
import { ConfigField } from "../../../../../../components/common/Form/interface";
import {
  BOOLEAN_FIElD_TYPE,
  CLIENT_USER_NAME,
  DATE_FIElD_TYPE,
  DESCRIPTION,
  DISPLAY_NAME,
  ErrorMessagesType,
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
  MESSAGE,
  NAME,
  REFERENCE_FIELD_TYPE,
  SHORT_STRING_FIElD_TYPE,
  trimCharactersAndNumbers,
  APPLICATION_NAME,
  DATE_AND_TIME_FIElD_TYPE,
  RuleType,
  FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN,
} from "@ranjodhbirkaur/constants";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import "./style.scss";
import Button from "@material-ui/core/Button";
import Looks3Icon from "@material-ui/icons/Looks3";
import Looks5Icon from "@material-ui/icons/Looks5";
import Looks4Icon from "@material-ui/icons/Looks4";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import CodeIcon from "@material-ui/icons/Code";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { RootState } from "../../../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import {
  doGetRequest,
  doPostRequest,
  doPutRequest,
} from "../../../../../../utils/baseApi";
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
import BasicTableMIUI from "../../../../../../components/common/BasicTableMIUI";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { Alert } from "../../../../../../components/common/Toast";
import { AlertDialog } from "../../../../../../components/common/AlertDialog";
import { useHistory } from "react-router";
import ModalDialog from "../../../../../../components/common/ModalDialog";
import { RenderHeading } from "../../../../../../components/common/RenderHeading";
import { CommonButton } from "../../../../../../components/common/CommonButton";
import {
  FIELD_ONLY_SPECIFIED_VALUES,
  FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
  FIELD_NAME,
  FIELD_ID,
  FIELD_NAME_GROUP,
  FIELD_DESCRIPTION,
  FIELD_ASSET_TYPE,
  FIELD_DEFAULT_VALUE,
  FIELD_PROHIBIT_SPECIFIC_PATTERN,
  FIELD_MATCH_SPECIFIC_PATTERN_STRING,
  FIELD_MATCH_SPECIFIC_PATTERN,
  FIELD_LIMIT_CHARACTER_COUNT_GROUP,
  FIELD_REFERENCE_MODEL_GROUP,
  FIELD_LIMIT_VALUE_GROUP,
  FIELD_DEFAULT_VALUE_GROUP,
  FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
  FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
  FIELD_REFERENCE_MODEL_TYPE,
  FIELD_REFERENCE_MODEL_NAME,
} from "./constants";
import { getNameFields, getPropertyFields } from "./fields";
import { ModelSetting, ModelSettingType } from "./ModelSetting";
import { DropDown } from "../../../../../../components/common/Form/DropDown";
import { DATA_ROUTES, paletteColor } from "../../../../../../utils/constants";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
import ApplicationName from "../..";

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateDataModelType = PropsFromRedux;

interface FieldData {
  fieldName?: string;
  fieldDescription?: string;
  fieldMax?: string | number;
  fieldMin?: string | number;
  fieldMatchPattern?: string;
  fieldMatchCustomPattern?: string;
  fieldProhibitPattern?: string;
  fieldMinMaxCustomErrorMessage?: string;
  fieldMatchPatternCustomError?: string;
  fieldProhibitPatternCustomError?: string;
  fieldOnlySpecifiedValues?: string;
  fieldDefaultValue?: string;
  fieldDisplayName?: string;
  fieldIsRequired?: string;
  fieldIsUnique?: string;
  fieldAssetsType?: string;
  fieldType?: string;
}

interface ContentModelBasicInfoType {
  name: string;
  description: string;
  displayName: string;
  id: string;
  titleProperty: string;
}

const CreateDataModel = (props: CreateDataModelType) => {
  const [modelNames, setModelNames] = useState<
    { label: string; value: string }[]
  >([]);
  const [settingFieldName, setSettingFieldName] = useState<boolean>(false);
  const [addingField, setAddingField] = useState<boolean>(false);

  const [fieldData, setFieldData] = useState<FieldData>({});

  const [fieldEditMode, setFieldEditMode] = useState<boolean>(false);

  const [hideNames, setHideNames] = useState<boolean>(false);

  const [contentModelData, setContentModelData] =
    useState<ContentModelBasicInfoType>({
      name: "",
      description: "",
      displayName: "",
      id: "",
      titleProperty: "",
    });

  const [properties, setProperties] = useState<RuleType[] | null>(null);

  const [formResponse, setFormResponse] = useState<
    string | ErrorMessagesType[]
  >("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // to show alerts
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [alert, setAlertMessage] = React.useState<AlertType>({ message: "" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [deleteEntryName, setDeleteEntryName] = useState<string>("");

  const [modelSetting, setModelSetting] = useState<ModelSettingType>({
    id: null,
    getPermittedUserGroups: [],
    postPermittedUserGroups: [],
    putPermittedUserGroups: [],
    deletePermittedUserGroups: [],

    getRestrictedUserGroups: [],
    postRestrictedUserGroups: [],
    putRestrictedUserGroups: [],
    deleteRestrictedUserGroups: [],
    supportedDomains: [],
    isPublic: false,
  });

  const { env, applicationName, language } = props;

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

  const history = useHistory();

  const GetCollectionNamesUrl = DATA_ROUTES.GetCollectionNamesUrl;
  const CollectionUrl = DATA_ROUTES.CollectionUrl;

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

    const contentModelName = name
      ? name
      : trimCharactersAndNumbers(displayName);

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
      onClickSaveDataModel(newData, properties || []);
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
      let propertyIsIndexable = "";

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
          case "indexable": {
            propertyIsIndexable = v;
            break;
          }
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
      let errors: { message: string }[] = [];

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

  function onClickAddFields() {
    setAddingField(true);
    setHideNames(true);
  }

  /*
   * Show message alert
   * */
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

  /*Clear Alert*/
  function clearAlert() {
    setTimeout(() => {
      setIsAlertOpen(false);
      setAlertMessage({
        message: "",
      });
    }, 3000);
  }

  async function onClickSaveDataModel(
    contentModelData: ContentModelBasicInfoType,
    properties: RuleType[]
  ) {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    // validate
    if (!contentModelData.displayName) {
      setIsAlertOpen(true);
      setAlertMessage({
        message: "Please add model name",
        severity: "error",
      });
      clearAlert();
      return;
    }

    if (clientUserName && properties && properties.length) {
      const url = CollectionUrl.replace(":clientUserName", clientUserName)
        .replace(":env", env)
        .replace(":applicationName", applicationName);

      let resp;

      if (contentModelData.id) {
        resp = await doPutRequest(
          `${getBaseUrl()}${url}`,
          {
            name: contentModelData.name,
            displayName: contentModelData.displayName,
            description: contentModelData.description,
            rules: properties,
            id: contentModelData.id,
            titleField: contentModelData.titleProperty,
            setting: modelSetting.id,
          },
          true
        );
        setFormResponse(resp);
      } else {
        resp = await doPostRequest(
          `${getBaseUrl()}${url}`,
          {
            name: contentModelData.name,
            displayName: contentModelData.displayName,
            description: contentModelData.description,
            rules: properties,
            titleField: contentModelData.titleProperty,
            setting: modelSetting.id,
          },
          true
        );
        if (resp?.id) {
          setContentModelData({
            ...contentModelData,
            id: resp.id,
          });
        }
        setFormResponse(resp);
      }

      if (resp && !resp.errors) {
        const url = dashboardCreateDataModelsUrl.replace(
          `:${APPLICATION_NAME}`,
          applicationName
        );
        history.push(`${url}?name=${contentModelData.name}`);
      } else if (resp.errors && resp.errors.length) {
        setIsAlertOpen(true);
        let message = "";
        resp.errors.map((errorItem: ErrorMessagesType, index: number) => {
          return (message += `${index + 1}: ${errorItem[MESSAGE]} \n`);
        });
        setAlertMessage({
          message,
          severity: "error",
        });
      }
    } else if (!properties || !properties.length) {
      setIsAlertOpen(true);
      setAlertMessage({
        message: "Please add fields",
        severity: "error",
      });
      clearAlert();
    }
  }

  /*Handle click on cancel add field*/
  function onClickCancelAddField() {
    setAddingField(false);
  }

  function fieldItem(
    name: string,
    description: string,
    Icon: JSX.Element,
    value: string
  ) {
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

  function renderNameSection() {
    function onClick() {
      // turn off fields
      // turn off setting fields property
      // open name form
      setSettingFieldName(false);
      setAddingField(false);
      setHideNames(false);
    }

    return (
      <Grid
        container
        justify={"space-between"}
        direction="column"
        className="name-section-container"
      >
        <Grid item>
          <Grid container justify="flex-start">
            <Grid item className={"text-container"}>
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
            <Grid item className={"edit-button"}>
              <Tooltip title={`Edit model ${contentModelData.displayName}`}>
                <IconButton onClick={onClick} color="primary" size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container className="title-container" direction="column">
            <Grid item>
              <RenderHeading type="secondary" value="Set a title field" />
            </Grid>

            <Grid item>
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
                onBlur={() => {}}
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

  function onClickDeleteProperty(propertyName: string) {
    if (properties) {
      const tempProperties = properties.filter((propertyItem) => {
        return propertyItem.name !== propertyName;
      });
      setProperties(tempProperties);
    }
  }

  function renderPropertiesSection() {
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
          ...fieldData,
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

  /*Close the form of fields properties*/
  function closeAddFieldForm() {
    setFieldData({});
    setFieldEditMode(false);
    setSettingFieldName(false);
  }

  function renderAddFieldsAndSaveModelButtonGroup() {
    if (contentModelData.displayName) {
      return (
        <Grid container justify={"flex-end"} className={"modal-action-buttons"}>
          <CommonButton
            name={"Add Fields"}
            onClick={onClickAddFields}
            color={"secondary"}
            variant={"contained"}
          />
          {properties && properties.length ? (
            <CommonButton
              name={"Save Model"}
              className={"save-model"}
              onClick={() => onClickSaveDataModel(contentModelData, properties)}
              color={"primary"}
              variant={"contained"}
            />
          ) : null}
        </Grid>
      );
    }
    return null;
  }

  // When settings is created save the model
  useEffect(() => {
    if (modelSetting.id) {
      onClickSaveDataModel(contentModelData, properties || []);
    }
  }, [modelSetting.id]);

  return (
    <Grid container className={"create-data-model-container"}>
      {isLoading ? <Loader /> : null}

      <Grid item className="left-container">
        <Grid
          style={{ flexWrap: "nowrap" }}
          container
          className={"model-name-container"}
          justify="space-between"
        >
          <Grid item>{renderNameSection()}</Grid>
          <Grid item className="round-padding">
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
        <Grid container className="create-model-container">
          <Grid item className="create-content-model">
            <Grid>
              {contentModelData.displayName ? (
                renderPropertiesSection()
              ) : (
                <RenderHeading
                  className={"add-name-heading"}
                  value={"Please add name of the model"}
                  type={"secondary"}
                />
              )}
            </Grid>

            {addingField ? (
              <Grid container className="fields-container">
                <Grid container justify={"space-between"}>
                  <Grid item>
                    <RenderHeading
                      className="field-heading-container"
                      type={"primary"}
                      value={"Add new field"}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container justify={"center"} direction={"column"}>
                      <CommonButton
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
                  justify={"center"}
                  className="fields-grid"
                >
                  {fieldItem(
                    "Formatted Text",
                    "customised text with links and media",
                    <TextFieldsIcon />,
                    LONG_STRING_FIELD_TYPE
                  )}
                  {fieldItem(
                    "Text",
                    "names, paragraphs, title",
                    <TextFieldsIcon />,
                    SHORT_STRING_FIElD_TYPE
                  )}
                  {fieldItem(
                    "Number",
                    "numbers like age, count, quantity",
                    <Grid className={"numbers"}>
                      <Looks3Icon />
                      <Looks4Icon />
                      <Looks5Icon />
                    </Grid>,
                    INTEGER_FIElD_TYPE
                  )}
                  {fieldItem(
                    "Date",
                    "only date, years, months, days",
                    <DateRangeIcon />,
                    DATE_FIElD_TYPE
                  )}
                  {fieldItem(
                    "Date and time",
                    "date with time, days, hours, events",
                    <AccessTimeIcon />,
                    DATE_AND_TIME_FIElD_TYPE
                  )}
                  {fieldItem(
                    "Location",
                    "coordinates",
                    <LocationOnIcon />,
                    LOCATION_FIELD_TYPE
                  )}
                  {fieldItem(
                    "Boolean",
                    "true or false",
                    <ToggleOffIcon />,
                    BOOLEAN_FIElD_TYPE
                  )}
                  {fieldItem(
                    "Json",
                    "json data",
                    <CodeIcon />,
                    JSON_FIELD_TYPE
                  )}
                  {fieldItem(
                    "Media",
                    "videos, photos, files",
                    <PermMediaIcon />,
                    MEDIA_FIELD_TYPE
                  )}
                  {fieldItem(
                    "Reference",
                    "For example a comment can refer to authors",
                    <LinkIcon />,
                    REFERENCE_FIELD_TYPE
                  )}
                </Grid>
              </Grid>
            ) : settingFieldName ? null : (
              renderAddFieldsAndSaveModelButtonGroup()
            )}
          </Grid>
        </Grid>
      </Grid>
      {/* MODAL SETTING CONTAINER */}

      {properties && properties.length ? (
        <Grid item className="right-container">
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

      <Alert
        isAlertOpen={isAlertOpen}
        onAlertClose={setIsAlertOpen}
        severity={alert.severity}
        message={alert.message}
      />
      <ModalDialog
        title={`${
          fieldEditMode || contentModelData.id ? "Edit" : "Create new"
        } Model`}
        isOpen={!hideNames}
        handleClose={() => setHideNames(true)}
        children={
          <Form
            response={formResponse}
            submitButtonName={"Save model name"}
            className={"create-content-model-form"}
            fields={nameFields}
            showClearButton={true}
            onSubmit={onSubmitCreateContentModel}
          />
        }
      />

      <ModalDialog
        title={`Field`}
        isOpen={!!settingFieldName}
        handleClose={closeAddFieldForm}
        children={
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
              <CommonButton
                variant={"outlined"}
                name={"Cancel"}
                color={"primary"}
                onClick={closeAddFieldForm}
              />
            </Grid>
            <Grid item>
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
                fields={propertyNameFields()}
                className={"field-property-form"}
              />
            </Grid>
          </Grid>
        }
      />
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
export default connector(CreateDataModel);

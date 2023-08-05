import {
  RuleType,
  CLIENT_USER_NAME,
  APPLICATION_NAME,
  ErrorMessagesType,
  MESSAGE,
} from "@ranjodhbirkaur/constants";
import { createContext, useState, useContext } from "react";
import { AlertType } from "../../../../../../../components/common/Form";
import {
  doPutRequest,
  doPostRequest,
} from "../../../../../../../utils/baseApi";
import { DATA_ROUTES } from "../../../../../../../utils/constants";
import { getItemFromLocalStorage } from "../../../../../../../utils/tools";
import {
  getBaseUrl,
  dashboardCreateDataModelsUrl,
} from "../../../../../../../utils/urls";
import { ModelSettingType } from "../ModelSetting";
import { useHistory } from "react-router";
import {
  ContextStateType,
  ContentModelBasicInfoType,
  PropertyType,
  FormResponseType,
  ContextType,
  FieldDataType,
} from "../types";

const initialState: ContextStateType = {
  settingFieldName: false,
  addingField: false,
  fieldData: {},
  hideNames: false,
  confirmDialogOpen: false,
  contentModelData: {
    name: "",
    description: "",
    displayName: "",
    id: "",
    titleProperty: "",
  },
  properties: null,
  formResponse: "",
  isLoading: false,
  isAlertOpen: false,
  alert: { message: "" },
  deleteEntryName: "",
  fieldEditMode: false,
  modelSetting: {
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
  },
};

const initialContext: ContextType = {
  ...initialState,
  setAddingField: () => undefined,
  setHideNames: () => undefined,
  setContentModelData: () => undefined,
  setProperties: () => undefined,
  setFormResponse: () => undefined,
  setIsAlertOpen: () => undefined,
  setAlertMessage: () => undefined,
  setModelSetting: () => undefined,
  setFieldData: () => undefined,
  setSettingFieldName: () => undefined,
  setDeleteEntryName: () => undefined,
  setConfirmDialogOpen: () => undefined,
  setFieldEditMode: () => undefined,
  setIsLoading: () => undefined,
  clearAlert: () => undefined,
  onClickAddFields: () => undefined,
  onClickSaveDataModel: async () => undefined,
};

const AppContext = createContext<ContextType>(initialContext);

export function AppStateProvider(props: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<ContextStateType>(initialState);

  const setAddingField = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        addingField: action,
      };
    });
  };

  const setHideNames = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        hideNames: action,
      };
    });
  };

  const setContentModelData = (action: ContentModelBasicInfoType) => {
    setAppState((old) => {
      return {
        ...old,
        contentModelData: action,
      };
    });
  };

  const setProperties = (action: PropertyType) => {
    setAppState((old) => {
      return {
        ...old,
        properties: action,
      };
    });
  };

  const setFormResponse = (action: FormResponseType) => {
    setAppState((old) => {
      return {
        ...old,
        formResponse: action,
      };
    });
  };

  const setIsAlertOpen = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        isAlertOpen: action,
      };
    });
  };

  const setAlertMessage = (action: AlertType) => {
    setAppState((old) => {
      return {
        ...old,
        alert: action,
      };
    });
  };

  const setModelSetting = (action: ModelSettingType) => {
    setAppState((old) => {
      return {
        ...old,
        modelSetting: action,
      };
    });
  };

  const setFieldData = (action: FieldDataType) => {
    setAppState((old) => {
      return {
        ...old,
        fieldData: action,
      };
    });
  };

  const setSettingFieldName = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        settingFieldName: action,
      };
    });
  };

  const setConfirmDialogOpen = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        confirmDialogOpen: action,
      };
    });
  };

  const setFieldEditMode = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        fieldEditMode: action,
      };
    });
  };

  const setIsLoading = (action: boolean) => {
    setAppState((old) => {
      return {
        ...old,
        fieldEditMode: action,
      };
    });
  };

  const setDeleteEntryName = (action: string) => {
    setAppState((old) => {
      return {
        ...old,
        deleteEntryName: action,
      };
    });
  };

  function clearAlert() {
    setTimeout(() => {
      setAppState((old) => {
        return {
          ...old,
          isAlertOpen: false,
          alert: { message: "" },
        };
      });
    }, 3000);
  }

  function onClickAddFields() {
    setAppState((old) => {
      return {
        ...old,
        addingField: true,
        hideNames: true,
      };
    });
  }

  const { modelSetting } = appState;

  const history = useHistory();

  async function onClickSaveDataModel(
    contentModelData: ContentModelBasicInfoType,
    properties: RuleType[],
    env: string,
    applicationName: string
  ) {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    // const GetCollectionNamesUrl = DATA_ROUTES.GetCollectionNamesUrl;
    const CollectionUrl = DATA_ROUTES.CollectionUrl;
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

  const methods = {
    setHideNames,
    setAddingField,
    setFormResponse,
    setProperties,
    setContentModelData,
    onClickSaveDataModel,
    onClickAddFields,
    clearAlert,
    setModelSetting,
    setAlertMessage,
    setIsAlertOpen,
    setFieldData,
    setSettingFieldName,
    setDeleteEntryName,
    setConfirmDialogOpen,
    setFieldEditMode,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={{ ...appState, ...methods }}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}

export function withAppState(WrappedComponent: any) {
  return (props: any) => {
    return (
      <AppStateProvider>
        <WrappedComponent {...props} />
      </AppStateProvider>
    );
  };
}

import { Grid } from "@mui/material";
import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  ENV,
} from "@ranjodhbirkaur/constants";
import { useEffect, useState } from "react";
import { CommonCheckBoxField } from "../../../../../../../components/common/Form/CommonCheckBoxField";
import {
  doGetRequest,
  doPostRequest,
  doPutRequest,
} from "../../../../../../../utils/baseApi";
import { AUTH_ROUTES, DATA_ROUTES } from "../../../../../../../utils/constants";
import {
  getItemFromLocalStorage,
  getUrlSearchParams,
} from "../../../../../../../utils/tools";
import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import GroupIcon from "@mui/icons-material/Group";
import { AccordianCommon } from "../../../../../../../components/common/AccordianCommon";
import "./style.scss";
import { TextBox } from "../../../../../../../components/common/Form/TextBox";
import { RenderHeading } from "../../../../../../../components/common/RenderHeading";

export interface ModelSettingType {
  id: string | null;
  isPublic: boolean;
  supportedDomains: string[];
  getRestrictedUserGroups: { id: string; name: string; description: string }[];
  postRestrictedUserGroups: { id: string; name: string; description: string }[];
  putRestrictedUserGroups: { id: string; name: string; description: string }[];
  deleteRestrictedUserGroups: {
    id: string;
    name: string;
    description: string;
  }[];

  getPermittedUserGroups: { id: string; name: string; description: string }[];
  postPermittedUserGroups: { id: string; name: string; description: string }[];
  putPermittedUserGroups: { id: string; name: string; description: string }[];
  deletePermittedUserGroups: {
    id: string;
    name: string;
    description: string;
  }[];
}

interface SettingType {
  data: ModelSettingType;
  applicationName: string;
  env: string;
  setSetting: (id: ModelSettingType) => void;
  isLoading: boolean;
}

export const ModelSetting = (props: SettingType) => {
  const { env, applicationName, data, setSetting } = props;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME) || "";
  const [userGroups, setUserGroups] = useState<
    {
      description: string;
      id: string;
      name: string;
    }[]
  >([]);

  const setting: any = data;

  // supported domain
  const [supportedDomainsValue, setSupportedDomainsValue] = useState("");

  async function createModelSetting() {
    const url = DATA_ROUTES.SettingsUrl.replace(`:${ENV}`, env)
      .replace(`:${CLIENT_USER_NAME}`, clientUserName)
      .replace(`:${APPLICATION_NAME}`, applicationName);

    const response = await doPostRequest(url, {}, true);

    if (response && response.id) {
      setSetting({
        ...setting,
        id: response.id,
      });
    }
  }

  function updateSetting(
    type: "isPublic" | "restrictedUserGroups" | "permittedUserGroups",
    value: any
  ) {
    const udpatedSetting: ModelSettingType = {
      ...setting,
      [type]: value,
    };
    setSetting(udpatedSetting);
    requestUpdateSetting(udpatedSetting);
  }

  async function requestUpdateSetting(updatedSetting: ModelSettingType) {
    // If there is no id no required to update
    if (!setting.id) return;
    const url = DATA_ROUTES.SettingsUrl.replace(`:${ENV}`, env)
      .replace(`:${CLIENT_USER_NAME}`, clientUserName)
      .replace(`:${APPLICATION_NAME}`, applicationName);

    await doPutRequest(
      url,
      {
        ...setting,
        isPublic: updatedSetting.isPublic,
        getRestrictedUserGroups: updatedSetting.getRestrictedUserGroups.map(
          (rg) => rg.id
        ),
        postRestrictedUserGroups: updatedSetting.postRestrictedUserGroups.map(
          (rg) => rg.id
        ),
        putRestrictedUserGroups: updatedSetting.putRestrictedUserGroups.map(
          (rg) => rg.id
        ),
        deleteRestrictedUserGroups:
          updatedSetting.deleteRestrictedUserGroups.map((rg) => rg.id),

        getPermittedUserGroups: updatedSetting.getPermittedUserGroups.map(
          (rg) => rg.id
        ),
        postPermittedUserGroups: updatedSetting.postPermittedUserGroups.map(
          (rg) => rg.id
        ),
        deletePermittedUserGroups: updatedSetting.deletePermittedUserGroups.map(
          (rg) => rg.id
        ),
        putPermittedUserGroups: updatedSetting.putPermittedUserGroups.map(
          (rg) => rg.id
        ),

        supportedDomains: updatedSetting.supportedDomains,
      },
      true
    );
  }

  // Create a model setting
  useEffect(() => {
    const modelName = getUrlSearchParams("name");
    if (modelName && data && data.id) {
      if (data.id && data.id !== null && setting.id !== data.id) {
        setSetting({
          ...data,
        });
      }
    }
    if (!modelName && data.id === null) {
      createModelSetting();
    }
  }, [data]);

  // Fetch User Groups
  useEffect(() => {
    fetchUserGroups();
  }, []);

  async function fetchUserGroups() {
    const url = AUTH_ROUTES.userGroupUrl
      .replace(`:${CLIENT_USER_NAME}`, clientUserName)
      .replace(`:${APPLICATION_NAME}`, applicationName)
      .replace(`:${ENV}`, env);

    const response = await doGetRequest(url, {}, true);
    setUserGroups(response);
  }

  function renderPermissions(
    type: "restrict" | "permitted",
    requestType: "get" | "post" | "delete" | "put"
  ) {
    const property: any =
      type === "permitted"
        ? `${requestType}PermittedUserGroups`
        : `${requestType}RestrictedUserGroups`;
    const otherProperty: any =
      type === "permitted"
        ? `${requestType}RestrictedUserGroups`
        : `${requestType}PermittedUserGroups`;

    return (
      <Grid container={true} className="user-groups" direction="column">
        <Grid item={true}>
          <RenderHeading value={type}></RenderHeading>
        </Grid>
        <Grid item={true}>
          {setting &&
          setting[otherProperty] &&
          setting[property] &&
          userGroups?.length
            ? userGroups?.map((userGroup, index) => {
                let disabled = !!setting[otherProperty].length;
                const exist = (() => {
                  const found = setting[property].find(
                    (ug: any) => ug.id === userGroup.id
                  );
                  const alsoFound = setting[otherProperty].find(
                    (ug: any) => ug.id === userGroup.id
                  );
                  if (alsoFound) {
                    disabled = true;
                    return false;
                  }
                  return found;
                })();

                function onClickDoneIcon() {
                  const updatedSetting = {
                    ...setting,
                    [property]: [...setting[property], userGroup],
                  };
                  setSetting(updatedSetting);
                  requestUpdateSetting(updatedSetting);
                }

                function onClickRemoveIcon() {
                  const temp = setting[property].filter(
                    (ug: any) => ug.id !== userGroup.id
                  );
                  const updatedSettting = {
                    ...setting,
                    [property]: temp,
                  };
                  setSetting(updatedSettting);
                  requestUpdateSetting(updatedSettting);
                }

                return (
                  <Chip
                    disabled={disabled}
                    color={exist ? "secondary" : undefined}
                    size="medium"
                    key={index}
                    icon={<GroupIcon />}
                    deleteIcon={exist ? <CloseIcon /> : <DoneIcon />}
                    onDelete={exist ? onClickRemoveIcon : onClickDoneIcon}
                    label={userGroup.name}
                    variant="outlined"
                  />
                );
              })
            : null}
        </Grid>
      </Grid>
    );
  }

  function renderSupportedDomain() {
    function onblur() {
      const domainNames: string[] = [];
      supportedDomainsValue.split(",").map((item) => {
        const exist = setting.supportedDomains.find(
          (domain: string) => domain === item
        );
        if (!exist && item) {
          domainNames.push(item.trim());
        }
      });
      setSupportedDomainsValue("");
      const updatedSetting = {
        ...setting,
        supportedDomains: [...setting.supportedDomains, ...domainNames],
      };
      setSetting({
        ...setting,
        ...updatedSetting,
      });

      requestUpdateSetting(updatedSetting);
    }

    function onEnter(event: any) {
      const code = event.keyCode ? event.keyCode : event.which;
      if (code === 13) {
        onblur();
      }
    }

    return (
      <Grid container={true} className="supported-domain" direction="column">
        <Grid item={true}>
          {setting?.supportedDomains.map(
            (supportedDomain: string, index: number) => {
              if (!supportedDomain) return null;

              function onClickDeleteIcon() {
                const domainNames = setting.supportedDomains.filter(
                  (s: string) => s !== supportedDomain
                );

                const updatedSetting = {
                  ...setting,
                  supportedDomains: domainNames,
                };
                setSetting({
                  ...setting,
                  ...updatedSetting,
                });

                requestUpdateSetting(updatedSetting);
              }

              return (
                <Chip
                  color={"primary"}
                  size="medium"
                  key={index}
                  icon={<GroupIcon />}
                  deleteIcon={<CloseIcon />}
                  onDelete={onClickDeleteIcon}
                  label={supportedDomain}
                  variant="outlined"
                />
              );
            }
          )}
        </Grid>

        <Grid item={true}>
          <TextBox
            type="text"
            placeholder="Supported domain url"
            value={supportedDomainsValue}
            className=""
            onChange={(event) => {
              setSupportedDomainsValue(event.target.value);
            }}
            onBlur={onblur}
            onKeyDown={onEnter}
            name="supported domain"
            label="Supported Domain"
            descriptionText="Add comma seperated supported domain names"
            required={false}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <AccordianCommon name="permissions">
      <Grid className="setting-container">
        <CommonCheckBoxField
          onChange={(e: any) => updateSetting("isPublic", e.target.checked)}
          placeholder=""
          value={setting.isPublic ? "true" : "false"}
          descriptionText="If you want this data to be access and updated by any one. Mark it as public"
          className=""
          required={false}
          name="isPublic"
          label="Is public"
        />

        {userGroups?.length && !setting.isPublic ? (
          <>
            <AccordianCommon name="Get permission">
              <Grid container={true} direction="column">
                <Grid item={true}>{renderPermissions("restrict", "get")}</Grid>
                <Grid item={true}>{renderPermissions("permitted", "get")}</Grid>
              </Grid>
            </AccordianCommon>

            <AccordianCommon name="Post permission">
              <Grid container={true} direction="column">
                <Grid item={true}>{renderPermissions("restrict", "post")}</Grid>
                <Grid>{renderPermissions("permitted", "post")}</Grid>
              </Grid>
            </AccordianCommon>

            <AccordianCommon name="Put permission">
              <Grid container={true} direction="column">
                <Grid item={true}>{renderPermissions("restrict", "put")}</Grid>
                <Grid item={true}>{renderPermissions("permitted", "put")}</Grid>
              </Grid>
            </AccordianCommon>

            <AccordianCommon name="Delete permission">
              <Grid container={true} direction="column">
                <Grid item={true}>{renderPermissions("restrict", "delete")}</Grid>
                <Grid item={true}>{renderPermissions("permitted", "delete")}</Grid>
              </Grid>
            </AccordianCommon>
          </>
        ) : null}

        <AccordianCommon name="Supported domains">
          {renderSupportedDomain()}
        </AccordianCommon>
      </Grid>
    </AccordianCommon>
  );
};

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../rootReducer";
import "./asset-adder.scss";
import { RenderHeading } from "../../RenderHeading";
import UploadAsset from "../../../common/UploadAsset";
import { getItemFromLocalStorage } from "../../../../utils/tools";
import {
  CLIENT_USER_NAME,
  MULTIPLE_ASSETS_TYPE,
  SINGLE_ASSETS_TYPE,
} from "@ranjodhbirkaur/constants";
import { getBaseUrl } from "../../../../utils/urls";
import { Avatar, Chip } from "@mui/material";
import Loader from "../../Loader";
import { Button } from "../../Button";
import { AssetsTable } from "../../../../modules/assets/AssetsTable";
import ModalDialog from "../../ModalDialog";
import { Alert } from "../../Toast";
import { AlertType } from "../index";

type PropsFromRedux = ConnectedProps<typeof connector>;
type AssetsAdderType = PropsFromRedux & {
  className: string;
  value: string;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
  descriptionText: string;
  label: string;
  // avoid multiple assets if single asset type
  assetType?: string;
  // init assets data while editing assets type
  assetInit?: FileUploadType[];
};

export interface FileUploadType {
  id: string;
  tbU: string;
  name: string;
  type: string;
}

export const AssetsAdderComponent = (props: AssetsAdderType) => {
  const {
    className,
    value,
    onChange,
    descriptionText,
    onBlur,
    label,
    assetType,
    assetInit,
    assetsUrls,
  } = props;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
  const [filesIds, setFilesIds] = useState<FileUploadType[]>([]);

  // to show alert on single and multiple restriction
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [alert, setAlertMessage] = React.useState<AlertType>({ message: "" });

  // to handle select assets
  const [isEntryFormOpen, setIsEntryFormOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const url = props.assetsUrls ? props.assetsUrls.authAssets : "";
  const authUrl = `${getBaseUrl()}${url}`;

  /*If value changes from back update the ids*/
  useEffect(() => {
    if (value && !isLoading && typeof value === "string") {
      const joinedValue = value.split(",");
      const newIds: FileUploadType[] = [];
      if (joinedValue && joinedValue.length) {
        joinedValue.forEach((item) => {
          const exist = filesIds.find((id) => id.id === item);
          if (exist) {
            newIds.push(exist);
          }
        });
        setFilesIds(newIds);
      }
    }
  }, [value]);

  function updateValue(ids: FileUploadType[]) {
    if (ids && ids.length) {
      const event = {
        target: {
          value: ids.map((id) => id.id).join(","),
        },
      };
      onBlur(event);
      setTimeout(() => {
        onChange(event);
      }, 100);
    }
  }

  /*Remove reference*/
  function removeReference(id: string) {
    const filtered = filesIds.filter((item) => item.id !== id);
    setFilesIds(filtered);
    setTimeout(() => {
      updateValue(filtered);
    });
  }

  // when file ids change update value
  useEffect(() => {
    updateValue(filesIds);
  }, [filesIds]);

  // set fileIds when initAsset is there
  useEffect(() => {
    if (assetInit) {
      setFilesIds(assetInit);
    }
  }, [assetInit]);

  function showAlert(alertParam: AlertType) {
    setIsAlertOpen(true);
    setAlertMessage({
      message: alertParam.message,
      severity: alertParam.severity,
    });
  }

  /*call back function on select an asset*/
  function callBackOnSelect(asset: FileUploadType) {
    if (assetType === SINGLE_ASSETS_TYPE && filesIds && filesIds.length > 0) {
      showAlert({
        message: "Only one asset can be selected",
        severity: "error",
      });
      return;
    }
    setFilesIds([...filesIds, asset]);
  }

  /*call back function on de select an asset*/
  function callBackOnDeSelect(id: string) {
    removeReference(id);
  }

  return (
    <Grid className={`${className} assets-adder-editor-wrapper`}>
      <RenderHeading value={label} type={"primary"} />
      <RenderHeading value={descriptionText} type={"secondary"} />
      <Grid container justify={"flex-end"}>
        {assetType === MULTIPLE_ASSETS_TYPE ||
        (filesIds.length < 1 && assetType === SINGLE_ASSETS_TYPE) ? (
          <Grid
            container
            justify={"center"}
            className={"action-button-wrapper"}
          >
            <UploadAsset
              setLoading={setIsLoading}
              setUploadedFiles={setFilesIds}
              uFiles={filesIds}
              // verify url
              v_3_5_6={props.assetsUrls && props.assetsUrls.verifyTempRecord}
              // temporary url
              t_s_4_6_3_t={
                props.assetsUrls && props.assetsUrls.createTempRecord
              }
              authUrl={authUrl.replace(
                `:${CLIENT_USER_NAME}`,
                clientUserName || ""
              )}
            />
            <Button
              onClick={() => setIsEntryFormOpen(true)}
              name={"Select Asset"}
            />
          </Grid>
        ) : null}
      </Grid>
      {isLoading ? <Loader /> : null}
      <Grid container className={"files-component"} justify={"flex-start"}>
        {filesIds.map((refId, index) => {
          return (
            <Chip
              key={index}
              onDelete={() => removeReference(refId.id)}
              label={refId.name}
              variant="outlined"
              avatar={<Avatar alt={refId.name} src={refId.tbU} />}
            />
          );
        })}
      </Grid>

      {/*Asset Select Modal*/}
      {assetsUrls ? (
        <ModalDialog
          isOpen={isEntryFormOpen}
          handleClose={() => setIsEntryFormOpen(false)}
          title={`Select Asset`}
          className={"asset-selector-modal-container"}
        >
          <AssetsTable
            assetsUrls={assetsUrls}
            onEntrySelectCallBack={callBackOnSelect}
            onEntryDeSelectCallBack={callBackOnDeSelect}
          />
        </ModalDialog>
      ) : null}
      <Alert
        isAlertOpen={isAlertOpen}
        onAlertClose={setIsAlertOpen}
        severity={alert.severity}
        message={alert.message}
      />
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    env: state.authentication.env,
    language: state.authentication.language,
    applicationName: state.authentication.applicationName,
    assetsUrls: state.routeAddress.routes.assets,
  };
};

const connector = connect(mapState);
export default connector(AssetsAdderComponent);

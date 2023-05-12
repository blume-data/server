import { useState } from "react";
import { getBaseUrl } from "../../utils/urls";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../rootReducer";
import { CLIENT_USER_NAME } from "@ranjodhbirkaur/constants";
import { getItemFromLocalStorage } from "../../utils/tools";
import Grid from "@mui/material/Grid";
import "./assets-component.scss";
import { AssetsTable } from "./AssetsTable";
// import UploadAsset from "../../components/common/UploadAsset";
import Loader from "../../components/common/Loader";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const AssetsComponent = (props: PropsFromRedux) => {
  const { assetsUrls } = props;
  const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const url = props.assetsUrls ? props.assetsUrls.authAssets : "";
  const authUrl = `${getBaseUrl()}${url}`;

  if (authUrl && clientUserName) {
    return (
      <Grid container={true} className={"assets-main-container-wrapper"}>
        <Grid container={true} justifyContent={"flex-end"}>
          {/* <UploadAsset
            setLoading={setIsLoading}
            verifyTempRecord={
              props.assetsUrls && props.assetsUrls.verifyTempRecord
            }
            createTempRecord={
              props.assetsUrls && props.assetsUrls.createTempRecord
            }
            authUrl={authUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName)}
          /> */}
        </Grid>
        {isLoading ? <Loader /> : null}
        <Grid className="table">
          {assetsUrls ? (
            <Grid className="asset-table-container-wrapper">
              <AssetsTable assetsUrls={assetsUrls} />
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    );
  }
  return null;
};

const mapState = (state: RootState) => {
  return {
    assetsUrls: state.routeAddress.routes.assets,
  };
};

const connector = connect(mapState);
export const Assets = connector(AssetsComponent);

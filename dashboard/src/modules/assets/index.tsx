import React from "react";
import {getBaseUrl} from "../../utils/urls";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../rootReducer";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../utils/tools";
import {UploadAsset} from "../../components/common/UploadAsset";
import Grid from "@material-ui/core/Grid";
import './assets-component.scss';
import {AssetsTable} from "./AssetsTable";



type PropsFromRedux = ConnectedProps<typeof connector>;
export const AssetsComponent = (props: PropsFromRedux) => {

    const {assetsUrls} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const url = props.assetsUrls ? props.assetsUrls.authAssets : '';
    const authUrl = `${getBaseUrl()}${url}`

    if(authUrl && clientUserName) {
        return (
            <Grid container className={'assets-main-container-wrapper'}>
                <Grid container justify={"flex-end"}>
                    <UploadAsset
                        v_3_5_6={props.assetsUrls && props.assetsUrls.v_3_5_6}
                        t_s_4_6_3_t={props.assetsUrls && props.assetsUrls.t_s_4_6_3_t}
                        authUrl={authUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName)}
                    />
                </Grid>
                <Grid className="table">
                    {
                        assetsUrls ? <AssetsTable assetsUrls={assetsUrls} /> : null
                    }
                </Grid>
            </Grid>
        );
    }
    return null;
}

const mapState = (state: RootState) => {
    return {
        assetsUrls: state.routeAddress.routes.assets
    }
};

const connector = connect(mapState);
export const Assets = connector(AssetsComponent);
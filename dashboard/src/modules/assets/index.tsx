import React, {useEffect} from "react";
import {getBaseUrl} from "../../utils/urls";
import {doGetRequest, doPostRequest} from "../../utils/baseApi";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../rootReducer";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../utils/tools";
import {UploadAsset} from "../../components/common/UploadAsset";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const AssetsComponent = (props: PropsFromRedux) => {

    const {assetsUrls} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    console.log('t_s_4_6_3_t', props);

    // Fetch Assets
    async function fetchAssets() {

        if(clientUserName && assetsUrls && assetsUrls.getAssets){
            const url = assetsUrls.getAssets.replace(`:${CLIENT_USER_NAME}`, clientUserName);
            const response = await doGetRequest(`${getBaseUrl()}${url}`, null, true);
            console.log('res', response);
        }

    }
    // fetch assets
    useEffect(() => {
        fetchAssets();
    }, [assetsUrls]);

    const url = props.assetsUrls ? props.assetsUrls.authAssets : '';
    const authUrl = `${getBaseUrl()}${url}`

    if(authUrl && clientUserName) {
        return (
            <div>
                <UploadAsset
                    v_3_5_6={props.assetsUrls && props.assetsUrls.v_3_5_6}
                    t_s_4_6_3_t={props.assetsUrls && props.assetsUrls.t_s_4_6_3_t}
                    authUrl={authUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName)}
                />
            </div>
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
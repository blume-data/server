import React, {useEffect} from "react";
import {getBaseUrl} from "../../utils/urls";
import {Input} from '@material-ui/core';
import axios from 'axios';
import {doGetRequest, doPostRequest} from "../../utils/baseApi";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../rootReducer";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {getItemFromLocalStorage} from "../../utils/tools";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const AssetsComponent = (props: PropsFromRedux) => {

    const {assetsUrls} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    console.log('asdf', props);

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

    async function onChangeFile(e: any) {
        const file = e.target.files[0];
        const fileType = file.type;

        if(clientUserName && assetsUrls && assetsUrls.getSignedUrl) {
            const signedUrl = assetsUrls.getSignedUrl.replace(`:${CLIENT_USER_NAME}`, clientUserName);
            const awsSignedUrl = await doPostRequest(`${getBaseUrl()}${signedUrl}`, {
                ContentType: file.type,
                name: file.name
            }, true);
            const config = {
                headers: {
                    'Content-Type': fileType
                }
            };
            if(awsSignedUrl && awsSignedUrl.url) {
                const awsREsp = await axios.put(awsSignedUrl.url, file, config);
                console.log('awsResp', awsREsp);
            }
        }

    }

    return (
        <div>
            <Input onChange={onChangeFile} type="file"/>
        </div>
    );
}

const mapState = (state: RootState) => {
    return {
        assetsUrls: state.routeAddress.routes.assets
    }
};

const connector = connect(mapState);
export const Assets = connector(AssetsComponent);
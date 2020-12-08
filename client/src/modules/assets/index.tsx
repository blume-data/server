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

    console.log('asdf', assetsUrls);

    // Fetch Assets
    async function fetchAssets() {
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        if(assetsUrls && clientUserName){
            const url = assetsUrls.replace(`:${CLIENT_USER_NAME}`, clientUserName);
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
        const response = await doPostRequest(`${getBaseUrl()}/assets/get-signed-url`, {
            ContentType: file.type,
            name: file.name
        }, true);
        const config = {
            headers: {
                'Content-Type': fileType
            }
        };
        const url = response && response.data && response.data.url;
        const awsREsp = await axios.put(url, file, config);
        console.log('awsResp', awsREsp);
    }

    return (
        <div>
            <Input onChange={onChangeFile} type="file"/>
        </div>
    );
}

const mapState = (state: RootState) => {
    return {
        assetsUrls: state.routeAddress.routes.assets?.getAssets
    }
};

const connector = connect(mapState);
export const Assets = connector(AssetsComponent);
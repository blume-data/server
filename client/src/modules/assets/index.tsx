import React, {useEffect} from "react";
import {getBaseUrl} from "../../utils/urls";
import {Input} from '@material-ui/core';
import axios from 'axios';
import {doGetRequest} from "../../utils/baseApi";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../rootReducer";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const AssetsComponent = (props: PropsFromRedux) => {

    const {assetsUrls} = props;

    // Fetch Assets
    async function fetchAssets() {
        if(assetsUrls){
            const response = await doGetRequest(`${getBaseUrl()}${assetsUrls}`, null);
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
        const response = await axios.post(`${getBaseUrl()}/assets/get-signed-url`, {
            ContentType: file.type,
            name: file.name
        });
        const config = {
            headers: {
                'Content-Type': fileType
            }
        };
        const url = response && response.data && response.data.url;
        const awsREsp = await axios.put(url, file[0], config);
        console.log('dsfs', awsREsp);
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
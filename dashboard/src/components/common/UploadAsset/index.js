import React from 'react';
import {Input} from "@material-ui/core";
import ImageKit from "imagekit-javascript"
import {doPostRequest} from "../../../utils/baseApi";
import {getItemFromLocalStorage} from "../../../utils/tools";
import {getBaseUrl} from "../../../utils/urls";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";

const onError = err => {
    console.log("Error", err);
};

const onSuccess = res => {
    console.log("Success", res);
};

export const UploadAsset = (props) => {
    console.log('props', props);
    const publicKey = 'public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=';
    const urlEndpoint = 'https://ik.imagekit.io/kafwriey64l/';
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const {t_s_4_6_3_t, v_3_5_6} = props;

    const imagekit = new ImageKit({
        publicKey,
        urlEndpoint,
        authenticationEndpoint: props.authUrl ? props.authUrl : ''
    });

    async function upload(e) {

        const file = e.target.files[0];
        const fileType = file.type;
        const r945 = t_s_4_6_3_t.replace(`:${CLIENT_USER_NAME}`, clientUserName);
        const r43 = v_3_5_6.replace(`:${CLIENT_USER_NAME}`, clientUserName);

        const t_0 = await doPostRequest(`${getBaseUrl()}${r945}`, {
            fileName: file.name
        }, true);



        imagekit.upload({
            file,
            fileName: file.name,
            tags: ["tag1"],
            isPrivateFile: true
        }, async function(err, result) {

            const ty = await doPostRequest(`${getBaseUrl()}${r43}`, {
                di_98: t_0,
                emanelif_89: result.name,
                htap_21: result.filePath,
                tu: result.thumbnailUrl,
                h: result.height,
                w: result.width,
                s: result.size
            })
            console.log('tu', ty);
        })
    }





    if(props.authUrl) {
        return (
            <div className="App">
                <h1>ImageKit React quick start</h1>
                <Input onChange={upload} type="file"/>
                {/* ...other SDK components added previously */}
            </div>
        );
    }
    return null;
}

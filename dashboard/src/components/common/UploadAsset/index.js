import React from 'react';
import ImageKit from "imagekit-javascript"
import {getItemFromLocalStorage, randomString, uploadImages} from "../../../utils/tools";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {CommonButton} from "../CommonButton";
import './upload-assets.scss';

export default (props) => {
    const publicKey = 'public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=';
    const urlEndpoint = 'https://ik.imagekit.io/kafwriey64l/';
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const {t_s_4_6_3_t, v_3_5_6} = props;
    // to get asset ids
    const {setLoading=null, setUploadedFiles=null, uFiles} = props;

    const imagekit = new ImageKit({
        publicKey,
        urlEndpoint,
        authenticationEndpoint: props.authUrl ? props.authUrl : ''
    });

    const componentId = randomString(10);

    function clickOnUploadInput() {
        document.getElementById(componentId).click();
    }

    async function upload(e) {

        await uploadImages({
            e, clientUserName, v_3_5_6, t_s_4_6_3_t, imagekit, setLoading, setUploadedFiles, uFiles
        });

    }

    if(props.authUrl) {
        return (
            <div className="upload-assets-container">
                <input id={componentId} className={'hidden-input'} onChange={upload} type="file" multiple/>
                <CommonButton
                    onClick={clickOnUploadInput}
                    name={'Add Assets'}
                    title={'Add Assets'}
                />
            </div>
        );
    }
    return null;
}

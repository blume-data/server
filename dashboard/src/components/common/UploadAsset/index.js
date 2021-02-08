import React from 'react';
import ImageKit from "imagekit-javascript"
import {getItemFromLocalStorage, uploadImages} from "../../../utils/tools";
import {CLIENT_USER_NAME} from "@ranjodhbirkaur/constants";
import {CommonButton} from "../CommonButton";
import {randomBytes} from "crypto";
import './upload-assets.scss';

export const UploadAsset = (props) => {
    const publicKey = 'public_k1JAmfGkYnDN/dhR+aVH6EpD9WM=';
    const urlEndpoint = 'https://ik.imagekit.io/kafwriey64l/';
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const {t_s_4_6_3_t, v_3_5_6} = props;

    const imagekit = new ImageKit({
        publicKey,
        urlEndpoint,
        authenticationEndpoint: props.authUrl ? props.authUrl : ''
    });

    const RANDOM_STRING = function (minSize=4) {
        return randomBytes(minSize).toString('hex')
    };

    const componentId = RANDOM_STRING(10);

    function clickOnUploadInput() {
        const el = document.getElementById(componentId).click();
    }

    async function upload(e) {

        await uploadImages({
            e, clientUserName, v_3_5_6, t_s_4_6_3_t, imagekit
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

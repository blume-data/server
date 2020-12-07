import React from "react";
import {getBaseUrl} from "../../utils/urls";
import axios from 'axios';

export const Assets = () => {

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
            <input onChange={onChangeFile} type="file"/>
        </div>
    );
}
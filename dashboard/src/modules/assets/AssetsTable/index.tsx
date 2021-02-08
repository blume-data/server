import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import BasicTableMIUI from '../../../components/common/BasicTableMIUI';
import {CLIENT_USER_NAME, ENTRY_CREATED_AT, ENTRY_CREATED_BY} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "../../../utils/baseApi";
import {getBaseUrl} from "../../../utils/urls";
import {getItemFromLocalStorage} from "../../../utils/tools";
import {DateTime} from "luxon";
import {UserCell} from "../../../components/common/UserCell";
import {DateCell} from "../../../components/common/DateCell";
import {Avatar} from "@material-ui/core";

interface AssetsType {
    clientUserName: string;
    createdAt: string;
    createdBy: string;
    fileName: string;
    height: number;
    isVerified: boolean;
    path: string;
    size: number;
    thumbnailUrl: string;
    width: number;
}
interface AssetsTableType {
    assetsUrls: {
        getAssets: string;
        getAsset: string;
    };
}
export const AssetsTable = (prop: AssetsTableType) => {

    const {assetsUrls} = prop;

    const [assets, setAssets] = useState<AssetsType[]>([]);
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const columns = [
        {name: 'Thumbnail', value: 'thumbnailUrl'},
        {name: 'Created by', value: ENTRY_CREATED_BY},
        {name: 'Created At', value: ENTRY_CREATED_AT},
        {name: 'fileName', value: 'fileName'},
        {name: 'type', value: 'type'},
        {name: 'Size', value: 'size'},
        {name: 'Dimensions', value: 'dimensions'},
    ]

    // Fetch Assets
    async function fetchAssets() {

        if(clientUserName && assetsUrls && assetsUrls.getAssets){
            const url = assetsUrls.getAssets.replace(`:${CLIENT_USER_NAME}`, clientUserName);
            const response = await doGetRequest(`${getBaseUrl()}${url}`, null, true);

            setAssets(response.map((i: any) => {
                const updatedAt = DateTime.fromISO(i.createdAt);
                const createdBy = <UserCell value={i.createdBy} />;
                const a = assetsUrls.getAsset.replace(`:${CLIENT_USER_NAME}`, clientUserName);
                const assetUrl = `${getBaseUrl()}${a}?fileName=${i.fileName}`;

                const thumbnailUrl = <a href={assetUrl} target={'_blank'}>
                    <Avatar alt={'a'} src={i.thumbnailUrl} />
                </a>
                const dimensions = `${i.height ? i.height : 0} * ${i.width ? i.width : 0} px`;
                return {
                    ...i,
                    thumbnailUrl,
                    createdAt: <DateCell value={updatedAt} />,
                    createdBy,
                    dimensions
                }
            }));
        }

    }
    // fetch assets
    useEffect(() => {
        fetchAssets();
    }, [assetsUrls]);

    return (
        <Grid className={'assets-table-container'}>
            <BasicTableMIUI
                columns={columns}
                tableName={'Assets'}
                rows={assets}
            />

        </Grid>
    );
}
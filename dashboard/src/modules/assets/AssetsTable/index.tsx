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
import Checkbox from "@material-ui/core/Checkbox";
import {PaginationTab} from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";

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
    onEntrySelectCallBack?: (str: string) => void;
    onEntryDeSelectCallBack?: (str: string) => void;
    initialSelectedEntries?: string[];
}
export const AssetsTable = (prop: AssetsTableType) => {

    const {assetsUrls, onEntrySelectCallBack, onEntryDeSelectCallBack} = prop;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [assets, setAssets] = useState<AssetsType[]>([]);
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
    const [response, setResponse] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageTotal, setPageTotal] = useState<number>(0);
    const perPage= 10;

    const columns = [
        {name: 'Id', value: 'id'},
        {name: 'Thumbnail', value: 'thumbnailUrl'},
        {name: 'Created by', value: ENTRY_CREATED_BY},
        {name: 'Created At', value: ENTRY_CREATED_AT},
        {name: 'fileName', value: 'fileName'},
        {name: 'type', value: 'type'},
        {name: 'Size', value: 'size'},
        {name: 'Dimensions', value: 'dimensions'},
    ]

    function onEntryDeSelect(id: string) {
        setSelectedEntries(selectedEntries.filter(i => i !== id));
    }

    function onEntrySelect(id: string) {
        setSelectedEntries([...selectedEntries, id]);
    }

    useEffect(() => {
        if(clientUserName) {
            setAssets(response.map((i: any) => {
                const updatedAt = DateTime.fromISO(i.createdAt);
                const createdBy = <UserCell value={i.createdBy} />;
                const a = assetsUrls.getAsset.replace(`:${CLIENT_USER_NAME}`, clientUserName);
                const assetUrl = `${getBaseUrl()}${a}?fileName=${i.fileName}`;
                const isChecked = selectedEntries.includes(i._id);
                function onChangeCheckBox() {
                    if(selectedEntries.includes(i._id)) {
                        setSelectedEntries(selectedEntries.filter(item => item !== i._id));
                        onEntryDeSelect(i._id);
                    }
                    else {
                        setSelectedEntries([...selectedEntries, i._id]);
                        onEntrySelect(i._id);
                    }
                }
                const id = <Checkbox checked={isChecked} value={i._id} onChange={onChangeCheckBox} />

                const thumbnailUrl = <a href={assetUrl} target={'_blank'}>
                    <Avatar alt={'a'} src={i.thumbnailUrl} />
                </a>
                const dimensions = `${i.height ? i.height : 0} * ${i.width ? i.width : 0} px`;
                return {
                    ...i,
                    id,
                    thumbnailUrl,
                    createdAt: <DateCell value={updatedAt} />,
                    createdBy,
                    dimensions
                }
            }));
        }
    }, [response, selectedEntries])

    // Fetch Assets
    async function fetchAssets() {

        if(clientUserName && assetsUrls && assetsUrls.getAssets){
            setIsLoading(true);
            const url = assetsUrls.getAssets.replace(`:${CLIENT_USER_NAME}`, clientUserName);
            const resp = await doGetRequest(`${getBaseUrl()}${url}?page=${page}&perPage=${perPage}`, null, true);
            if(resp && resp.data && resp.data.length) {
                setResponse(resp.data);
                setIsLoading(false);
            }
            if(resp && resp.total) {
                setPageTotal(resp.total);
            }
        }

    }
    // fetch assets
    useEffect(() => {
        fetchAssets();
    }, [assetsUrls, page]);

    // on all selected
    function selectAll() {
        if(response.length === selectedEntries.length) {
            setSelectedEntries([]);
        }
        else {
            setSelectedEntries(response.map((i: any) => i._id));
        }
    }

    function isAllSelected() {
        return response.length === selectedEntries.length
    }

    function onPageClick(e: any,page: number) {
        setPage(page);
    }

    return (
        <Grid container justify={"center"} direction={"column"} className={'assets-table-container'}>
            <BasicTableMIUI
                onSelectAll={selectAll}
                isAllSelected={isAllSelected()}
                columns={columns}
                tableName={'Assets'}
                rows={assets}
            />
            <Grid className={'pagination-component'}>
                {isLoading ? null : <PaginationTab
                    currentPage={page}
                    limit={perPage}
                    handleChange={onPageClick}
                    totalItems={pageTotal}
                    id={'pag'}
                />}
            </Grid>
            {isLoading ? <Loader /> : null}

        </Grid>
    );
}
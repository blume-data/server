import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from "react-redux";
import {
    APPLICATION_NAME,
    ENTRY_UPDATED_AT, ENTRY_UPDATED_BY, MEDIA_FIELD_TYPE,
    RuleType, SINGLE_ASSETS_TYPE, STATUS
} from "@ranjodhbirkaur/constants";
import Grid from "@material-ui/core/Grid";
import './entries-table.scss';
import BasicTableMIUI from "../BasicTableMIUI";
import {DateTime} from "luxon";
import {UserCell} from "../UserCell";
import {DateCell} from "../DateCell";
import {RootState} from "../../../rootReducer";
import {deleteModelEntries, fetchModelEntries, getModelDataAndRules} from "../../../utils/tools";
import {EntriesFilter} from "../../../modules/dashboard/pages/DateEntries/Entries-Filter/EntriesFilter";
import {EntryStatus} from "./EntryStatus";
import Checkbox from "@material-ui/core/Checkbox";
import Loader from "../Loader";
import {PaginationTab} from "../Pagination";
import {AvatarCommon} from "../AvatarCommon";
import { dashboardCreateDataEntryUrl } from '../../../utils/urls';
import { Link } from 'react-router-dom';
import { CommonButton } from '../CommonButton';
import { doDeleteRequest } from '../../../utils/baseApi';

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesTableType = PropsFromRedux & {
    modelName: string;
    setModelName?: (str: string) => void;

    // passed from outside
    selectable?: boolean;
    onEntrySelect?: (str: string) => void;
    onEntryDeSelect?: (str: string) => void;
    initialSelectedEntries?: string[];
}

const EntriesTableComponent = (props: EntriesTableType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [where, setWhere] = useState<any>({});
    const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
    const [response, setResponse] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageTotal, setPageTotal] = useState<number>(0);
    const perPage = 10;

    const {env, applicationName, GetCollectionNamesUrl, language, initialSelectedEntries,
        StoreUrl,
        GetEntriesUrl, modelName, setModelName, selectable=true, onEntrySelect, onEntryDeSelect} = props;

    useEffect(() => {
        getItems();
    }, [GetEntriesUrl, page]);

    // set selected entries on initialization
    useEffect(() => {
        if(initialSelectedEntries) {
            setSelectedEntries(initialSelectedEntries);
        }
    }, []);
    
    // update rows when selected or response is fetched
    useEffect(() => {
        const newRows = response.map((i: any) => {
            const assetTypeRows = rules && rules.filter(rule => rule.type === MEDIA_FIELD_TYPE);
            const updatedAt = DateTime.fromISO(i.updatedAt);
            const updatedBy = <UserCell value={i.updatedBy} />;
            const isChecked = selectedEntries.includes(i._id);
            const redirectUrl = dashboardCreateDataEntryUrl
                .replace(':id?', i._id)
                .replace(`:${APPLICATION_NAME}`, applicationName)
                .replace(`:modelName`, modelName);
            function onChangeCheckBox() {
                if(selectedEntries.includes(i._id)) {
                    setSelectedEntries(selectedEntries.filter(item => item !== i._id));
                    if(onEntryDeSelect) {
                        onEntryDeSelect(i._id);
                    }
                }
                else {
                    setSelectedEntries([...selectedEntries, i._id]);
                    if(onEntrySelect) {
                        onEntrySelect(i._id);
                    }
                }
            }
            const id = <Checkbox checked={isChecked} value={i._id} onChange={onChangeCheckBox} />
            let newRow = {
                ...i,
                status: <EntryStatus title={i.status} />,
                updatedAt: <DateCell value={updatedAt} />,
                edit: <Link to={redirectUrl}>Edit</Link>,
                updatedBy,
                id
            };

            if(assetTypeRows && assetTypeRows.length) {
                assetTypeRows.forEach(assetTypeRow => {
                    let component: JSX.Element | null;
                    if(assetTypeRow.assetsType === SINGLE_ASSETS_TYPE) {
                        component = <AvatarCommon alt={assetTypeRow.name} src={i[assetTypeRow.name].thumbnailUrl} />
                    }
                    else if(i[assetTypeRow.name] && i[assetTypeRow.name].length) {
                        component = <Grid container className={'entries-avatar-list'}>
                            {
                                i[assetTypeRow.name].map((assetRow: {fileName: string, thumbnailUrl: string}) => {
                                    console.log('row-map', i[assetTypeRow.name])
                                    return (
                                        <AvatarCommon alt={assetRow.fileName} src={assetRow.thumbnailUrl} />
                                    );
                                })
                            }
                        </Grid>
                    }
                    else {
                        component = null
                    }
                    newRow = {
                        ...newRow,
                        [assetTypeRow.name]: component
                    }
                })
            }
            return newRow;
        })
        setRows(newRows);
    }, [selectedEntries, response]);

    // Fetch records in the model
    async function getItems() {
        if(GetEntriesUrl && modelName) {
            setIsLoading(true);
            const resp = await fetchModelEntries({
                applicationName, modelName: modelName, language, env,
                GetEntriesUrl: `${GetEntriesUrl}?page=${page}`, where
            });
            if(resp && resp.data && Array.isArray(resp.data)) {
                setResponse(resp.data);
                if(resp && resp.total) {
                    setPageTotal(resp.total);
                }
            }
            setIsLoading(false);
        }

    }

    function renderModelLink(name: string) {
        return (
            <p>{name}</p>
        );
    }

    // update the columns with new fetched rules
    function updateColumns() {
        if(rules && rules.length) {

            const newColumns: any[] = [
                {name: 'Id', value: 'id'}
            ];

            rules.forEach(rule => {
                newColumns.push({
                    name: `${rule.displayName}`,
                    value: rule.name
                });
            });
            newColumns.push({name: 'Edit', value: 'edit'});
            newColumns.push({name: 'Status', value: STATUS});
            newColumns.push({name: 'Updated At', value: ENTRY_UPDATED_AT});
            newColumns.push({name: 'Updated by', value: ENTRY_UPDATED_BY});
            setColumns(newColumns);
        }
    }

    // fetch the rules and data of the model
    async function fetchModelDataAndRules() {
        if(GetCollectionNamesUrl) {
            const response = await getModelDataAndRules({
                GetCollectionNamesUrl, applicationName, modelName: modelName, language, env
            });
            if(response && !response.errors && response.length) {
                setRules(JSON.parse(response[0].rules));

            }
            setIsLoading(false);
        }
    }

    // update columns when rules are fetched
    useEffect(() => {
        updateColumns();
    }, [rules])

    // Fetch the model data and rules when collection names url is available
    useEffect(() => {
        fetchModelDataAndRules();
    }, [modelName, GetCollectionNamesUrl]);

    // If the model name is selected or changed fetch the entries of that model
    useEffect(() => {
        if(modelName) {
            getItems();
        }
    }, [modelName]);

    // where the where filters change fetch the entries
    useEffect(() => {
        let needsToBeSearched = false;
        // check if there is at least one property which has some value
        for(let p in where) {
            if(where.hasOwnProperty(p) && where[p]) {
                needsToBeSearched = true;
            }
        }
        if(needsToBeSearched && modelName) {
            getItems();
        }
    }, [where]);

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

    async function deleteSelectedEntries() {

        if(StoreUrl) {
            setIsLoading(true);
            const response = await deleteModelEntries({
                StoreUrl,
                applicationName,
                env,
                language,
                modelName,
                where: {
                    _id: selectedEntries
                }

            });
            getItems();
        }
    }

    console.log('selected entries', selectedEntries);

    return (
        <Grid
            className={'entries-table-container-wrapper'}>
            <Grid className="entries-filter-container">
                <EntriesFilter
                    setWhere={setWhere}
                    modelName={modelName}
                    setModelName={setModelName}
                    rules={rules}
                />
            </Grid>

            {isLoading ? <Loader /> : null}
            
            {
                selectedEntries && selectedEntries.length
                ? <Grid container justify={'flex-end'} className="action-buttons">
                    <Grid item className="action-button">
                        <CommonButton
                            onClick={deleteSelectedEntries}
                            name={'Delete Entries'}
                        />
                    </Grid>
                 </Grid>
                : null
            }

            <Grid className="entries-table">
                {
                    columns && columns.length ? <BasicTableMIUI
                        rows={rows}
                        onSelectAll={selectAll}
                        columns={columns}
                        isAllSelected={isAllSelected()}
                        tableName={'Entries'}
                    /> : <p>No models</p>
                }
            </Grid>

            <Grid className="data-entries-pagination-container">
                {isLoading
                    ? <Loader /> : response && response.length ? <PaginationTab
                    currentPage={page}
                    limit={perPage}
                    handleChange={onPageClick}
                    totalItems={pageTotal}
                    id={'pag'}
                /> : null}

            </Grid>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl
    }
};

const connector = connect(mapState);
export const EntriesTable = connector(EntriesTableComponent);
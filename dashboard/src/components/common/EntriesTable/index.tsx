import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from "react-redux";
import {
    ENTRY_UPDATED_AT, ENTRY_UPDATED_BY,
    RuleType, STATUS
} from "@ranjodhbirkaur/constants";
import Grid from "@material-ui/core/Grid";
import './entries-table.scss';
import BasicTableMIUI from "../BasicTableMIUI";
import {DateTime} from "luxon";
import {UserCell} from "../UserCell";
import {DateCell} from "../DateCell";
import {RootState} from "../../../rootReducer";
import {fetchModelEntries, getModelDataAndRules} from "../../../utils/tools";
import {EntriesFilter} from "../../../modules/dashboard/pages/DateEntries/Entries-Filter/EntriesFilter";
import {EntryStatus} from "./EntryStatus";
import Checkbox from "@material-ui/core/Checkbox";

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

    const {env, applicationName, GetCollectionNamesUrl, language, initialSelectedEntries,
        GetEntriesUrl, modelName, setModelName, selectable=true, onEntrySelect, onEntryDeSelect} = props;

    useEffect(() => {
        getItems()
    }, [GetEntriesUrl]);

    // set selected entries on initialization
    useEffect(() => {
        if(initialSelectedEntries) {
            setSelectedEntries(initialSelectedEntries);
        }
    }, []);
    // update rows when selected or response is fetched
    useEffect(() => {
        const newRows = response.map((i: any) => {
            const updatedAt = DateTime.fromISO(i.updatedAt);
            const updatedBy = <UserCell value={i.updatedBy} />;
            const isChecked = selectedEntries.includes(i._id);
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
            return {
                ...i,
                status: <EntryStatus title={i.status} />,
                updatedAt: <DateCell value={updatedAt} />,
                updatedBy,
                id
            }
        })
        setRows(newRows);
    }, [selectedEntries, response]);

    // Fetch records in the model
    async function getItems() {
        if(GetEntriesUrl && modelName) {
            setIsLoading(true);
            const resp = await fetchModelEntries({
                applicationName, modelName: modelName, language, env,
                GetEntriesUrl, where
            });
            setResponse(resp);
            setIsLoading(false);
        }

    }

    function renderModelLink(name: string) {
        return (
            <p>{name}</p>
        );
    }

    console.log('selected entries', selectedEntries);

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



        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl
    }
};

const connector = connect(mapState);
export const EntriesTable = connector(EntriesTableComponent);
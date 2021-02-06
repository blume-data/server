import React, {useEffect, useState} from 'react';
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getModelDataAndRules} from "../../../../../utils/tools";
import {
    ENTRY_UPDATED_AT, ENTRY_UPDATED_BY,
    RuleType, STATUS
} from "@ranjodhbirkaur/constants";
import Grid from "@material-ui/core/Grid";
import './entries-table.scss';
import {EntriesFilter} from "../Entries-Filter/EntriesFilter";
import BasicTableMIUI from "../../../../../components/common/BasicTableMIUI";
import {DateTime} from "luxon";
import {UserCell} from "../../../../../components/common/UserCell";
import {DateCell} from "../../../../../components/common/DateCell";

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesTableType = PropsFromRedux & {
    modelName: string;
    setModelName?: (str: string) => void;
}

const EntriesTableComponent = (props: EntriesTableType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [where, setWhere] = useState<any>({});

    const {env, applicationName, GetCollectionNamesUrl, language, GetEntriesUrl, modelName, setModelName} = props;

    const widthOfColumn = 200;

    useEffect(() => {
        if(modelName) {
            // init the table columns
            /*const tabColumns: ColDef[] = [
                { field: 'id', headerName: 'ID'},
                { field: 'updatedBy', headerName: 'Updated by', sortable:false, align: "left",width: widthOfColumn,
                    renderCell: ((params) => {
                        const value = params.getValue('updatedBy');
                        if(value) {
                            return <UserCell value={value} />
                        }
                        else {
                            return <p>{value}</p>;
                        }
                    })
                },
                { field: ENTRY_UPDATED_AT, headerName: 'Updated at', sortable:false, align: "left",width: widthOfColumn,
                    renderCell: ((params) => {
                        const value = `${params.getValue(ENTRY_UPDATED_AT) || ''}`
                        const timeStamp = DateTime.fromISO(value);
                        return <DateCell value={timeStamp} />
                    })
                },
                { field: 'status', headerName: 'Status', sortable:false, width: widthOfColumn,
                    renderCell: ((params) => {
                        const value = `${params.getValue('status') || ''}`;
                        return <Tooltip title={value}>
                            <Typography>{value}</Typography>
                        </Tooltip>
                    })
                },
            ];
            setColumns(tabColumns);*/
        }
    }, [setColumns, modelName]);

    // Fetch records in the model
    async function getItems() {
        if(GetEntriesUrl && modelName) {
            setIsLoading(true);
            const response = await fetchModelEntries({
                applicationName, modelName: modelName, language, env,
                GetEntriesUrl, where
            });

            setRows(response.map((i: any) => {
                const updatedAt = DateTime.fromISO(i.updatedAt);
                const updatedBy = <UserCell value={i.updatedBy} />;
                return {
                    ...i,
                    updatedAt: <DateCell value={updatedAt} />,
                    updatedBy
                    /*id: i._id,
                    lastName: i.lastName,
                    firstName: i.firstName*/
                }
            }));
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

            const newColumns: any[] = [];
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

    console.log('columns', columns);
    console.log('rows', rows)


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
                        columns={columns}
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
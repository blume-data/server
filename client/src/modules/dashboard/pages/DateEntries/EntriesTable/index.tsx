import React, {useEffect, useState} from 'react';
import {ColDef, DataGrid} from '@material-ui/data-grid';
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getModelDataAndRules} from "../../../../../utils/tools";
import {
    ENTRY_UPDATED_AT,
    REFERENCE_MODEL_NAME,
    RuleType
} from "@ranjodhbirkaur/constants";
import Grid from "@material-ui/core/Grid";
import './entries-table.scss';
import { DateTime } from 'luxon';
import Typography from "@material-ui/core/Typography";
import {Tooltip} from "@material-ui/core";
import {DateCell} from "../../../../../components/common/DateCell";
import {UserCell} from "../../../../../components/common/UserCell";
import {EntriesFilter} from "../Entries-Filter/EntriesFilter";

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesTableType = PropsFromRedux & {
    modelName: string;
    setModelName?: (str: string) => void;
}

const EntriesTableComponent = (props: EntriesTableType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState<ColDef[]>([]);

    const {env, applicationName, GetCollectionNamesUrl, language, GetEntriesUrl, modelName, setModelName} = props;

    const widthOfColumn = 200;

    useEffect(() => {
        if(modelName) {
            // init the table columns
            const tabColumns: ColDef[] = [
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
            setColumns(tabColumns);
        }
    }, [setColumns, modelName]);

    // Fetch records in the model
    async function getItems() {
        if(GetEntriesUrl && modelName) {
            setIsLoading(true);
            const response = await fetchModelEntries({
                applicationName, modelName: modelName, language, env,
                GetEntriesUrl
            });

            setRows(response.map((i: any) => {
                return {
                    ...i,
                    id: i._id,
                    lastName: i.lastName,
                    firstName: i.firstName
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
            const newColumns: ColDef[] = [];
            rules.forEach(rule => {
                newColumns.push({
                    headerName: rule.displayName,
                    field: rule.name,
                    width: widthOfColumn,
                    renderCell: (rule[REFERENCE_MODEL_NAME]
                        ? () => renderModelLink(rule[REFERENCE_MODEL_NAME])
                        : undefined
                    ),
                    sortable: !rule[REFERENCE_MODEL_NAME]
                });
            });
            setColumns([...columns, ...newColumns]);
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

    useEffect(() => {
        updateColumns();
    }, [rules])

    useEffect(() => {
        fetchModelDataAndRules();
    }, [modelName, GetCollectionNamesUrl]);

    useEffect(() => {
        if(modelName) {
            getItems();
        }
    }, [modelName])

    return (
        <Grid
            className={'entries-table-container-wrapper'}>
            <Grid className="entries-filter-container">
                <EntriesFilter
                    modelName={modelName}
                    setModelName={setModelName}
                    rules={rules}
                />
            </Grid>
            <DataGrid
                autoHeight={true}
                rows={rows}
                autoPageSize={true}
                disableColumnMenu={true}
                columns={columns}
                checkboxSelection
                hideFooterPagination={true}
                loading={isLoading}
                onSelectionChange={(d) => {
                    console.log('d', d)
                }}
            />
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
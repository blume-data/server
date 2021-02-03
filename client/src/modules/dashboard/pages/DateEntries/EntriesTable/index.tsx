import React, {useEffect, useState} from 'react';
import {ColDef} from '@material-ui/data-grid';
import loadable from "@loadable/component";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getItemFromLocalStorage, getModelDataAndRules} from "../../../../../utils/tools";
import {
    APPLICATION_NAME,
    CLIENT_USER_NAME,
    ENTRY_CREATED_AT, ENTRY_UPDATED_AT,
    REFERENCE_MODEL_NAME,
    RuleType
} from "@ranjodhbirkaur/constants";
import {doGetRequest} from "../../../../../utils/baseApi";
import {getBaseUrl} from "../../../../../utils/urls";
import Grid from "@material-ui/core/Grid";
import './entries-table.scss';
import { DateTime } from 'luxon';
import Typography from "@material-ui/core/Typography";
import {Tooltip} from "@material-ui/core";
import {DateCell} from "../../../../../components/common/DateCell";

const DataGrid = loadable(() => import('@material-ui/data-grid'), {
    resolveComponent: component => component.DataGrid,
});

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesTableType = PropsFromRedux & {
    modelName: string;
}

const EntriesTableComponent = (props: EntriesTableType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState<ColDef[]>([]);

    const {env, applicationName, GetCollectionNamesUrl, language, StoreUrl, modelName} = props;

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    const widthOfColumn = 200;

    useEffect(() => {
        // init the table columns
        const tabColumns: ColDef[] = [
            { field: 'id', headerName: 'ID'},

            { field: ENTRY_CREATED_AT, headerName: 'Created at', sortable:false, align: "left",width: widthOfColumn,
                renderCell: ((params) => {
                    const value = `${params.getValue(ENTRY_CREATED_AT) || ''}`
                    const timeStamp = DateTime.fromISO(value);
                    return <DateCell value={timeStamp} />
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
    }, [setColumns]);

    // Fetch records in the model
    async function getItems() {
        if(StoreUrl) {
            const url = StoreUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(':modelName', modelName)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const response = await doGetRequest(`${getBaseUrl()}${url}`, null, true);

            setRows(response);
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

    useEffect(() => {
        updateColumns();
    }, [rules])

    useEffect(() => {
        getItems();
        if(GetCollectionNamesUrl && clientUserName) {
            getModelDataAndRules({
                clientUserName, GetCollectionNamesUrl, setIsLoading, applicationName, modelName, setRules, language, env
            });
        }
    }, [modelName, GetCollectionNamesUrl]);

    return (
        <Grid
            className={'entries-table-container-wrapper'}
            style={{ height: 500, width: '100%' }} >
            <DataGrid
                autoHeight={true}
                rows={rows}
                autoPageSize={true}
                columns={columns}
                checkboxSelection
                hideFooterPagination={true}
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
        StoreUrl: state.routeAddress.routes.data?.StoreUrl
    }
};

const connector = connect(mapState);
export const EntriesTable = connector(EntriesTableComponent);




























/*import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../../rootReducer";
import {CLIENT_USER_NAME, RuleType} from '@ranjodhbirkaur/constants';
import {getItemFromLocalStorage} from "../../../../../utils/tools";

interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): Data {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
    { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
    { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    >
                        <TableSortLabel>
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

interface EnhancedTableToolbarProps {
    numSelected: number;
    title: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected, title } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {title}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : null
            }
        </Toolbar>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesTableType = PropsFromRedux & {
    modelName: string;
}
export const EntriesTableComponent = (props: EntriesTableType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState<[]>([]);

    const {env, applicationName, GetCollectionNamesUrl, language, StoreUrl, modelName} = props;

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

    useEffect(() => {
        // init the table columns
        const tabColumns: [] = [
            { field: 'id', headerName: 'ID'},
            { field: 'isPublished', headerName: 'Published', sortable:false},
            { field: 'date', headerName: 'Created at', sortable:false, align: "left",
                valueGetter: (params: ValueGetterParams) => `${params.getValue('createdAt') || ''}`
            },
        ];
        setColumns(tabColumns);
    }, [setColumns]);

    // Fetch records in the model
    async function getItems() {
        if(StoreUrl) {
            const url = StoreUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(':modelName', modelName)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const response = await doGetRequest(`${getBaseUrl()}${url}`, null, true);

            setRows(response);
        }

    }

    // update the columns with new fetched rules
    function updateColumns() {
        if(rules && rules.length) {
            const newColumns: ColDef[] = [];
            rules.forEach(rule => {
                newColumns.push({
                    headerName: rule.displayName,
                    field: rule.name
                });
            });
            setColumns([...columns, ...newColumns]);
        }
    }

    useEffect(() => {
        updateColumns();
    }, [rules])

    useEffect(() => {
        getItems();
        if(GetCollectionNamesUrl && clientUserName) {
            getModelDataAndRules({
                clientUserName, GetCollectionNamesUrl, setIsLoading, applicationName, modelName, setRules, language, env
            });
        }
    }, [modelName, GetCollectionNamesUrl]);










    const classes = useStyles();
    const [selected, setSelected] = React.useState<string[]>([]);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    title={modelName}
                    numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="Table"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.calories}</TableCell>
                                            <TableCell align="right">{row.fat}</TableCell>
                                            <TableCell align="right">{row.carbs}</TableCell>
                                            <TableCell align="right">{row.protein}</TableCell>
                                        </TableRow>
                                    );
                                })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl
    }
};

const connector = connect(mapState);
export const EntriesTable = connector(EntriesTableComponent);*/

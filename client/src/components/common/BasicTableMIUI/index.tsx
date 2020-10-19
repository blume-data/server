import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface BasicTableMIUIProps {
    tableRows: {
        name: string;
        value: string;
    }[];
    rows: any;
    tableName: string;
}

export default function BasicTableMIUI(props: BasicTableMIUIProps) {
    const classes = useStyles();

    const {tableName, tableRows, rows} = props;

    function renderRow(row: any, index: number) {
        console.log('row', row);
        const key = `${index}`;
        return (
            <TableRow key={key}>
                {tableRows.map((tableRow, index) => {

                    console.log('table row', tableRow);
                    return (
                        <TableCell component={index === 0 ? "th" : undefined} scope={index === 0 ? "row" : undefined}  align={index === 0 ? undefined : "right"}>
                            {row[tableRow.value]}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                            tableRows.map((tableRow, index) => {
                                return (
                                    <TableCell align={index === 0 ? 'left' : "right"} key={index}>{tableRow.name}</TableCell>
                                );
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(renderRow(row, index))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

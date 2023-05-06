import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface BasicTableMIUIProps {
  columns: {
    name: string;
    value: string;
    linkUrl?: boolean;
    onClick?: any;
    align?: "left" | "center" | "right";
  }[];
  rows: any;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  tableName: string;
}

export default function BasicTableMIUI(props: BasicTableMIUIProps) {
  const classes = useStyles();

  const { columns, rows, onSelectAll, isAllSelected = false } = props;

  function renderRow(row: any, index: number) {
    const key = `${index}`;
    return (
      <TableRow key={key}>
        {columns.map((tableRow, index) => {
          return (
            <TableCell
              key={index}
              component={index === 0 ? "th" : undefined}
              scope={index === 0 ? "row" : undefined}
              align={index === 0 ? "left" : tableRow.align || "left"}
            >
              {tableRow.linkUrl ? (
                <Link to={row["linkUrl"]}>{row[tableRow.value]}</Link>
              ) : (
                <div
                  onClick={
                    tableRow.onClick ? row[`${tableRow.value}-click`] : null
                  }
                  className={`table-cell-item ${
                    tableRow.onClick ? "has-on-click" : ""
                  }`}
                >
                  {row[tableRow.value]}
                </div>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper} className="basic-table-container">
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((tableRow, index) => {
              if (index === 0 && onSelectAll) {
                return (
                  <TableCell key={index} align={tableRow.align || "left"}>
                    <Checkbox checked={isAllSelected} onClick={onSelectAll} />
                  </TableCell>
                );
              }
              return (
                <TableCell
                  align={index === 0 ? "left" : tableRow.align || "left"}
                  key={index}
                >
                  {tableRow.name}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>{rows.map(renderRow)}</TableBody>
      </Table>
    </TableContainer>
  );
}

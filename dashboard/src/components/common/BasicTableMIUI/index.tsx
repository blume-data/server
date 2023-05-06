import React from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { Checkbox } from "@mui/material";

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

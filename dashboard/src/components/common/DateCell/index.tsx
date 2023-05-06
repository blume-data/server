import React from "react";
import { DateTime } from "luxon";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";

interface DateCellType {
  value: DateTime;
}

export const DateCell = (props: DateCellType) => {
  const { value } = props;
  const timeStamp = DateTime.fromISO(`${value}`);
  if (timeStamp) {
    return (
      <Tooltip
        title={timeStamp.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
      >
        <Typography component={"p"}>{timeStamp.toRelative()}</Typography>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={value}>
        <Typography component={"p"}>{value}</Typography>
      </Tooltip>
    );
  }
};

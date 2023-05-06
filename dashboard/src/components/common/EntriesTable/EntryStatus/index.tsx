import React from "react";
import { Grid } from "@material-ui/core";
import { RenderHeading } from "../../RenderHeading";

interface EntryStatusProps {
  title: string;
}
export const EntryStatus = (props: EntryStatusProps) => {
  const { title } = props;

  return (
    <Grid className={"entry-status-container"}>
      <RenderHeading value={title} />
    </Grid>
  );
};

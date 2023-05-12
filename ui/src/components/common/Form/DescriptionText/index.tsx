
import { Grid } from "@mui/material";
import "./style.scss";

export const DescriptionText = (props: { description: string }) => {
  return (
    <Grid className={"form-description-text"}>
      <p>{props.description}</p>
    </Grid>
  );
};

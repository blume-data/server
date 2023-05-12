import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { RootState } from "../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  dashboardCreateDataEntryUrl,
  dashboardDataEntriesUrl,
} from "../../../../utils/urls";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./data-entries.scss";
import { EntriesTable } from "../../../../components/common/EntriesTable";
import { RenderHeading } from "../../../../components/common/RenderHeading";

type PropsFromRedux = ConnectedProps<typeof connector>;

function DataEntriesComponent(props: PropsFromRedux) {
  const { applicationName } = props;
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const { modelName } = useParams<{ modelName: string }>();
  const history = useHistory();

  const createDataEntryUrl = dashboardCreateDataEntryUrl
    .replace(":applicationName", applicationName)
    .replace(":id?", "")
    .replace(":modelName", modelName);

  useEffect(() => {
    // Redirect to correct route
    if (selectedModelName) {
      const url = dashboardDataEntriesUrl
        .replace(":applicationName", applicationName)
        .replace(":modelName", selectedModelName);
      history.push(url);
    }
  }, [selectedModelName]);

  return (
    <Grid className={"data-entries-wrapper-container"}>
      <Grid container={true} className="data-entries" justifyContent="space-between">
        <Grid item={true}>
          <RenderHeading type="primary">Entries</RenderHeading>
          <br />
          <RenderHeading>Store entries in models</RenderHeading>
          <br />
        </Grid>
        <Grid className="center">
          {modelName ? (
            <Grid container={true} justifyContent={"center"} direction="column">
              <Grid item={true}>
                <Link to={createDataEntryUrl}>
                  <Button variant={"contained"} color={"primary"}>
                    create {`${modelName ? modelName : "entry"}`}
                  </Button>
                </Link>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <EntriesTable modelName={modelName} setModelName={setSelectedModelName} />
    </Grid>
  );
}

const mapState = (state: RootState) => {
  return {
    applicationName: state.authentication.applicationName,
  };
};

const connector = connect(mapState);
export const DataEntries = connector(DataEntriesComponent);

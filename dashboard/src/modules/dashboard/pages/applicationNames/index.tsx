import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ModalDialog from "../../../../components/common/ModalDialog";
import { APPLICATION_NAME } from "@ranjodhbirkaur/constants";
import { CreateApplicationName } from "./create-application-name";
import { RootState } from "../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import "./application-name.scss";
import { Link } from "react-router-dom";
import { dashboardApplicationNameUrl } from "../../../../utils/urls";
import { setApplicationName } from "../../../authentication/pages/Auth/actions";
import { useHistory } from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

const ApplicationNames = (props: PropsFromRedux) => {
  const { ApplicationNameUrl, setApplicationName, applicationNames } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const history = useHistory();

  function closeModal() {
    setIsModalOpen(false);
  }

  function onCreateApplicationName(applicationName: string) {
    closeModal();
    const url = dashboardApplicationNameUrl.replace(
      `:${APPLICATION_NAME}`,
      applicationName
    );
    setApplicationName(applicationName);
    history.push(url);
  }

  function onClickLink(name: string) {
    setApplicationName(name);
  }

  return (
    <Grid className={"application-name-container"}>
      <Grid container justify={"space-between"} className={"button-section"}>
        <Grid item className={"button-group"}>
          <Typography component={"h4"} variant={"h4"}>
            Application spaces
          </Typography>
          <Typography component={"p"}>
            Select any application space you want to manage today
          </Typography>
        </Grid>
        <Grid item className={"button-group"}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Space
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        justify={"center"}
        className={"application-spaces-list"}
        direction={"column"}
      >
        {applicationNames &&
          applicationNames.map((applicationName, index) => {
            return (
              <Link
                key={index}
                onClick={() => onClickLink(applicationName.name)}
                to={dashboardApplicationNameUrl.replace(
                  `:${APPLICATION_NAME}`,
                  applicationName.name
                )}
              >
                <Grid className="application-space-list-item" item>
                  {applicationName.name}
                </Grid>
              </Link>
            );
          })}
      </Grid>

      <ModalDialog
        isOpen={isModalOpen}
        title={"Create Application Space"}
        handleClose={closeModal}
      >
        <CreateApplicationName
          handleClose={onCreateApplicationName}
          url={ApplicationNameUrl ? ApplicationNameUrl : ""}
        />
      </ModalDialog>
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    ApplicationNameUrl: state.routeAddress.routes.data?.ApplicationNameUrl,
    applicationNames: state.authentication.applicationsNames,
  };
};

const connector = connect(mapState, { setApplicationName });
export default connector(ApplicationNames);

import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import {
  dashboardCreateDataModelsUrl,
  dashboardDataEntriesUrl,
  getBaseUrl,
} from "../../../../../utils/urls";
import { APPLICATION_NAME, CLIENT_USER_NAME } from "@ranjodhbirkaur/constants";
import "./store-list.scss";
import {
  getItemFromLocalStorage,
  getModelDataAndRules,
} from "../../../../../utils/tools";
import { doDeleteRequest } from "../../../../../utils/baseApi";
import BasicTableMIUI from "../../../../../components/common/BasicTableMIUI";
import Button from "@mui/material/Button";
import { RootState } from "../../../../../rootReducer";
import { connect, ConnectedProps } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { AlertDialog } from "../../../../../components/common/AlertDialog";
import Loader from "../../../../../components/common/Loader";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { DateCell } from "../../../../../components/common/DateCell";
import { DateTime } from "luxon";
import { UserCell } from "../../../../../components/common/UserCell";
import Checkbox from "@mui/material/Checkbox";
import { RenderHeading } from "../../../../../components/common/RenderHeading";

type PropsFromRedux = ConnectedProps<typeof connector>;

const DataModels = (props: PropsFromRedux) => {
  const {
    applicationName,
    env,
    language,
    GetCollectionNamesUrl,
    CollectionUrl,
  } = props;
  const [stores, setStores] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [deleteEntryName, setDeleteEntryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const history = useHistory();

  function onEntrySelect(i: string) {
    setSelectedEntries([...selectedEntries, i]);
  }

  function onEntryDeSelect(i: string) {
    setSelectedEntries(selectedEntries.filter((ii) => ii !== i));
  }

  useEffect(() => {
    setStores(
      response.map((item) => {
        function openConfirmAlert(modelName: string) {
          setDeleteEntryName(modelName);
          setConfirmDialogOpen(true);
        }
        const updatedAt = DateTime.fromISO(item.updatedAt);
        const updatedBy = <UserCell value={item.updatedBy} />;
        const isChecked = selectedEntries.includes(item._id);
        function onChangeCheckBox() {
          if (selectedEntries.includes(item._id)) {
            setSelectedEntries(
              selectedEntries.filter((ite) => ite !== item._id)
            );
            onEntryDeSelect(item._id);
          } else {
            setSelectedEntries([...selectedEntries, item._id]);
            onEntrySelect(item._id);
          }
        }
        const id = (
          <Checkbox
            checked={isChecked}
            value={item._id}
            onChange={onChangeCheckBox}
          />
        );
        return {
          ...item,
          id,
          linkUrl: `${dashboardDataEntriesUrl
            .replace(":modelName?", item.name)
            .replace(":applicationName", applicationName)}`,
          edit: (
            <IconButton>
              <EditIcon color="primary" />
            </IconButton>
          ),
          delete: (
            <IconButton>
              <DeleteIcon color="secondary" />
            </IconButton>
          ),
          "delete-click": () => openConfirmAlert(item.name),
          "edit-click": () => onClickEdit(item.name),
          updatedAt: <DateCell value={updatedAt} />,
          updatedBy,
        };
      })
    );
  }, [response, selectedEntries]);

  async function getCollectionNames() {
    if (GetCollectionNamesUrl && applicationName) {
      setIsLoading(true);

      const resp = await getModelDataAndRules({
        applicationName,
        env,
        language,
        GetCollectionNamesUrl,
        getOnly: "name,description,updatedAt,updatedById,displayName",
      });

      if (resp && Array.isArray(resp)) {
        setResponse(resp);
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCollectionNames();
  }, [applicationName, env, language, GetCollectionNamesUrl]);

  const tableRows: any = [
    { name: "Id", value: "id" },
    { name: "Name", value: "displayName", linkUrl: true },
    { name: "Description", value: "description" },
    { name: "Updated by", value: "updatedBy" },
    { name: "Updated At", value: "updatedAt" },
    { name: "EDIT", value: "edit", onClick: true, align: "center" },
    { name: "Delete", value: "delete", onClick: true },
  ];

  async function onClickConfirmDeleteModel(modelName: string) {
    if (CollectionUrl) {
      setIsLoading(true);
      const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

      const url = CollectionUrl.replace(
        `:${CLIENT_USER_NAME}`,
        clientUserName ? clientUserName : ""
      )
        .replace(":env", env)
        .replace(":language", language)
        .replace(`:${APPLICATION_NAME}`, applicationName);
      const response = await doDeleteRequest(
        `${getBaseUrl()}${url}`,
        { name: modelName },
        true
      );
      if (response) {
        await getCollectionNames();
      }
    }
  }

  const createModelUrl = dashboardCreateDataModelsUrl.replace(
    `:${APPLICATION_NAME}`,
    applicationName
  );

  function onClickEdit(name: string) {
    history.push(`${createModelUrl}?name=${name}`);
  }
  // on all selected
  function selectAll() {
    if (response.length === selectedEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(response.map((i: any) => i._id));
    }
  }

  // is all selected
  function isAllSelected() {
    return response.length === selectedEntries.length;
  }

  return (
    <Grid className={"store-list-container"}>
      {isLoading ? <Loader /> : null}

      <Grid className={"filter-section"} container justifyContent={"space-between"}>
        <Grid item={true}>
          <RenderHeading type="primary">Models</RenderHeading>
          <br />
          <RenderHeading>
            Configure sturcture of your data with creating model
          </RenderHeading>
          <br />
        </Grid>
        <Grid item={true} className={"add-store-button"}>
          {/*open model and clear model data*/}
          <Link to={createModelUrl}>
            <Button variant="contained" color={"primary"}>
              Create model
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent={"center"}
        className={"stores-list"}
        direction={"column"}
      >
        {stores && stores.length ? (
          <BasicTableMIUI
            isAllSelected={isAllSelected()}
            onSelectAll={selectAll}
            rows={stores}
            columns={tableRows}
            tableName={"stores"}
          />
        ) : (
          <Typography>You don't have any models yet</Typography>
        )}
      </Grid>

      <AlertDialog
        onClose={() => {
          setConfirmDialogOpen(false);
          setDeleteEntryName("");
        }}
        open={confirmDialogOpen}
        onConfirm={() => {
          onClickConfirmDeleteModel(deleteEntryName);
          setDeleteEntryName("");
          setConfirmDialogOpen(false);
        }}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setDeleteEntryName("");
        }}
        title={"Confirm delete action"}
        subTitle={`Please confirm if you want to delete ${deleteEntryName} model?`}
      />
    </Grid>
  );
};

const mapState = (state: RootState) => {
  return {
    env: state.authentication.env,
    language: state.authentication.language,
    applicationName: state.authentication.applicationName,
    GetCollectionNamesUrl:
      state.routeAddress.routes.data?.GetCollectionNamesUrl,
    CollectionUrl: state.routeAddress.routes.data?.CollectionUrl,
  };
};

const connector = connect(mapState);
export default connector(DataModels);

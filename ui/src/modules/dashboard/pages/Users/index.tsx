import { Grid, IconButton } from "@mui/material";
import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  ENV,
  SupportedUserType,
} from "@ranjodhbirkaur/constants";
import { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import BasicTableMIUI from "../../../../components/common/BasicTableMIUI";
import { Button } from "../../../../components/common/Button";
import { Form } from "../../../../components/common/Form";
import {
  ConfigField,
  DROPDOWN,
  TEXT,
} from "../../../../components/common/Form/interface";
import ModalDialog from "../../../../components/common/ModalDialog";
import { RootState } from "../../../../rootReducer";
import {
  doGetRequest,
  doPostRequest,
  doPutRequest,
} from "../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../utils/tools";
import EditIcon from "@mui/icons-material/Edit";
import "./style.scss";
import { useParams } from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ModalDataType {
  hide: boolean;
  title: string;
  type: "user" | "group";
}
export const UsersComponent = (props: PropsFromRedux) => {
  const { userGroupUrl, applicationName, env, otherUserUrl } = props;

  const [userGroups, setUserGroups] = useState<
    { name: string; description: string }[]
  >([]);
  const [users, setUsers] = useState<
    { userName: string; type: string; password: string; userGroup: string }[]
  >([]);

  const [userFormData, setUserFormData] = useState<{
    data?: any;
    response?: any;
  } | null>(null);

  const [groupFormData, setGroupFormData] = useState<{
    show?: boolean;
    data?: any;
    response?: any;
  } | null>(null);

  const { type } = useParams<{ type: string }>();

  const [urls, setUrls] = useState<{ user: string; group: string }>({
    user: "",
    group: "",
  });
  const [modalData, setModalData] = useState<ModalDataType | null>(null);

  function setSomeUrls() {
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    if (userGroupUrl && clientUserName && otherUserUrl) {
      const url = userGroupUrl
        .replace(`:${CLIENT_USER_NAME}`, clientUserName)
        .replace(`:${APPLICATION_NAME}`, applicationName)
        .replace(`:${ENV}`, env);
      const url2 = otherUserUrl
        .replace(`:${CLIENT_USER_NAME}`, clientUserName)
        .replace(`:${APPLICATION_NAME}`, applicationName)
        .replace(`:${ENV}`, env);
      setUrls({
        ...urls,
        group: url,
        user: url2,
      });
    }
  }

  // set some url
  useEffect(() => {
    if (applicationName && env) {
      setSomeUrls();
    }
  }, [applicationName, env, userGroupUrl]);

  const userModelfields: ConfigField[] = [
    {
      name: "userName",
      placeholder: "Set a unique username of the user",
      label: "Username",
      className: "",
      value: userFormData?.data?.userName,
      inputType: TEXT,
      required: false,
      descriptionText: "Set a unique username of the user",
    },
    {
      name: "email",
      placeholder: "Set a unique email of the user",
      label: "Email",
      className: "",
      value: userFormData?.data?.email,
      inputType: TEXT,
      required: false,
      type: "email",
      descriptionText: "Set a unique email of the user",
    },
    {
      name: "password",
      required: true,
      placeholder: "Set a password for the user",
      label: "Password",
      className: "",
      value: userFormData?.data?.password,
      inputType: TEXT,
      descriptionText: "Set a password for the user",
    },
    {
      name: "type",
      required: true,
      placeholder: "Select the User type of user",
      label: "Select the User type of user",
      className: "",
      value: userFormData?.data?.type,
      inputType: DROPDOWN,
      descriptionText: "Select the User type of user",
      options: SupportedUserType.map((userType: any) => {
        return {
          label: userType,
          value: userType,
        };
      }),
    },
    {
      name: "userGroup",
      required: true,
      placeholder: "Select the User group of user",
      label: "Select the User group of user",
      className: "",
      value: userFormData?.data?.userGroup || [],
      multiple: true,
      inputType: DROPDOWN,
      descriptionText: "Select the User group of user",
      options:
        userGroups && userGroups.length
          ? userGroups.map((userGroup: any) => {
              return {
                label: userGroup.name,
                value: userGroup.id,
              };
            })
          : [],
    },
  ];

  const userGroupfields: ConfigField[] = [
    {
      name: "name",
      required: true,
      placeholder: "User group name",
      label: "User group name",
      className: "",
      value: groupFormData?.data?.name,
      inputType: TEXT,
    },
    {
      name: "description",
      required: false,
      placeholder: "Description",
      label: "Description",
      className: "",
      value: groupFormData?.data?.description,
      inputType: TEXT,
    },
  ];

  // fetch user groups
  useEffect(() => {
    if (urls.group) {
      fetchUserGroups();
      fetchUsers();
    }
  }, [urls]);

  async function fetchUserGroups() {
    const response = await doGetRequest(urls.group, {}, true);
    setUserGroups(response);
  }

  async function fetchUsers() {
    const response = await doGetRequest(urls.user, {}, true);
    setUsers(response);
  }

  function component(type: "user" | "group") {
    function onClick() {
      setModalData({
        hide: false,
        title: `Create ${type}`,
        type,
      });
    }

    function onClickEdit(data: any) {
      // console.log('on click edit');
      if (type === "user") {
        setUserFormData({
          ...userFormData,
          data: {
            ...data,
            userGroup: data.userGroups.map((grp: { id: string }) => grp.id),
          },
        });
      } else {
        setGroupFormData({
          ...groupFormData,
          data,
        });
      }
      setModalData({
        hide: false,
        title: `Update ${type}`,
        type,
      });
    }

    const columnsForGroups: any = [
      { name: "Name", value: "name" },
      { name: "Description", value: "description" },
      { name: "Edit", value: "edit", align: "center" },
    ];

    const columnsForUsers: any = [
      { name: "Username", value: "userName" },
      { name: "Type", value: "type" },
      { name: "Edit", value: "edit", align: "center" },
    ];

    const rowForUsers = users.map((user: any) => {
      return {
        ...user,
        edit: (
          <IconButton onClick={() => onClickEdit(user)}>
            <EditIcon color="primary" />
          </IconButton>
        ),
      };
    });

    const rowForGroups = userGroups.map((user: any) => {
      return {
        ...user,
        edit: (
          <IconButton onClick={() => onClickEdit(user)}>
            <EditIcon color="primary" />
          </IconButton>
        ),
      };
    });

    return (
      <Grid container={true} direction="column">
        <Grid container={true} justifyContent="flex-end" className="accordian-top">
          <Grid item={true}>
            <Button onClick={onClick} name={`create ${type}`} />
          </Grid>
        </Grid>

        <Grid className="entries-table" container>
          <BasicTableMIUI
            tableName="user groups"
            rows={type === "group" ? rowForGroups : rowForUsers}
            columns={type === "group" ? columnsForGroups : columnsForUsers}
          />
        </Grid>
      </Grid>
    );
  }

  function getForm(type: "user" | "group") {
    function closeModal() {
      if (type === "user") fetchUsers();
      else fetchUserGroups();

      handleModalClose();
    }

    async function onSubmitGroup(values: any) {
      let response;
      if (groupFormData && groupFormData.data && groupFormData.data.id) {
        response = await doPutRequest(
          urls.group,
          {
            ...values,
            id: groupFormData.data.id,
          },
          true
        );
      } else {
        response = await doPostRequest(urls.group, values, true);
      }
      if (response && response.errors) {
        setGroupFormData({
          ...groupFormData,
          response: response.errors,
        });
      } else {
        closeModal();
        setGroupFormData({
          data: undefined,
        });
      }
    }

    async function onSubmitUser(values: any) {
      // console.log("values", values);

      let response;
      if (userFormData && userFormData.data && userFormData.data.id) {
        response = await doPutRequest(
          urls.user,
          {
            ...values,
            id: userFormData.data.id,
          },
          true
        );
      } else {
        response = await doPostRequest(
          urls.user,
          {
            ...values,
            userGroups: values.userGroup,
            userGroup: undefined,
          },
          true
        );
      }
      if (response && response.errors) {
        setUserFormData({
          ...userFormData,
          response: response.errors,
        });
      } else {
        closeModal();
      }
    }

    return (
      <Form
        getValuesAsObject={true}
        response={
          type === "user" ? userFormData?.response : groupFormData?.response
        }
        className=""
        onSubmit={type === "user" ? onSubmitUser : onSubmitGroup}
        fields={type === "user" ? userModelfields : userGroupfields}
      />
    );
  }

  function handleModalClose() {
    setModalData(null);
    setUserFormData(null);
    setGroupFormData(null);
  }

  return (
    <Grid container={true} direction="column" className="users-and-group-container">
      {type === "group" ? component("group") : component("user")}

      <ModalDialog
        title={modalData?.title || "Save"}
        isOpen={modalData?.hide === false}
        handleClose={handleModalClose}
        children={
          modalData?.type === "user" ? getForm("user") : getForm("group")
        }
      />
    </Grid>
  );
};

function mapStateToProps(state: RootState) {
  return {
    applicationName: state.authentication.applicationName,
    userGroupUrl: state.routeAddress.routes.auth?.userGroupUrl,
    env: state.authentication.env,
    otherUserUrl: state.routeAddress.routes.auth?.otherUserUrl,
  };
}
const connector = connect(mapStateToProps);
export const Users = connector(UsersComponent);

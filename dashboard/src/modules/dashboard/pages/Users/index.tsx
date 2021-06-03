import { Grid, IconButton } from "@material-ui/core";
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV, freeUserType, SupportedUserType } from "@ranjodhbirkaur/constants";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux"
import { AccordianCommon } from "../../../../components/common/AccordianCommon";
import BasicTableMIUI from "../../../../components/common/BasicTableMIUI";
import { CommonButton } from "../../../../components/common/CommonButton";
import { Form } from "../../../../components/common/Form";
import { ConfigField, DROPDOWN, TEXT } from "../../../../components/common/Form/interface";
import ModalDialog from "../../../../components/common/ModalDialog";
import { RenderHeading } from "../../../../components/common/RenderHeading";
import { RootState } from "../../../../rootReducer";
import { doGetRequest, doPostRequest, doPutRequest } from "../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../utils/tools";
import EditIcon from '@material-ui/icons/Edit';
import './style.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ModalDataType {
    hide: boolean;
    title: string;
    type: 'user' | 'group'
}
export const UsersComponent = (props: PropsFromRedux) => {

    const {userGroupUrl, applicationName, env, otherUserUrl} = props;

    const [userGroups, setUserGroups] = useState<{name: string, description: string}[]>([]);
    const [users, setUsers] = useState<{userName: string, type: string, password: string, userGroup: string}[]>([]);

    const [userFormData, setUserFormData] = useState<{
        data?: any;
        response?: any;
    } | null>(null);

    const [groupFormData, setGroupFormData] = useState<{
        show?: boolean;
        data?: any;
        response?: any;
    } | null>(null);

    const [urls, setUrls] = useState<{user: string; group: string}>({user: '', group: ''});
    const [modalData, setModalData] = useState<ModalDataType | null>(null);

    function setSomeUrls() {
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
            if(userGroupUrl && clientUserName && otherUserUrl) {
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
                    user: url2
                });
            }
    }

    // set some url
    useEffect(() => {
        if(applicationName && env) {
            setSomeUrls();
        }
    }, [applicationName, env, userGroupUrl])

    const userModelfields: ConfigField[] = [
        {
            name: 'userName',
            required: true,
            placeholder: 'Set a unique username of the user',
            label: 'Username',
            className: '',
            value: userFormData?.data?.userName,
            inputType: TEXT
        },
        {
            name: 'password',
            required: true,
            placeholder: 'Set a password for the user',
            label: 'Password',
            className: '',
            value: userFormData?.data?.password,
            inputType: TEXT
        },
        {
            name: 'type',
            required: true,
            placeholder: 'Select the User type of user',
            label: 'Select the User type of user',
            className: '',
            value: userFormData?.data?.type,
            inputType: DROPDOWN,
            options: SupportedUserType.map((userType: any) => {
                return {
                    label: userType,
                    value: userType
                }
            })
        },
        {
            name: 'userGroup',
            required: true,
            placeholder: 'Select the User group of user',
            label: 'Select the User group of user',
            className: '',
            value: userFormData?.data?.userGroup || [],
            multiple: true,
            inputType: DROPDOWN,
            options: userGroups && userGroups.length ? userGroups.map((userGroup: any) => {
                return {
                    label: userGroup.name,
                    value: userGroup.id
                }
            }) : []
        }  
    ];

    const userGroupfields: ConfigField[] = [
        {
            name: 'name',
            required: true,
            placeholder: 'User group name',
            label: 'User group name',
            className: '',
            value: groupFormData?.data?.name,
            inputType: TEXT
        },
        {
            name: 'description',
            required: false,
            placeholder: 'Description',
            label: 'Description',
            className: '',
            value: groupFormData?.data?.description,
            inputType: TEXT
        },
    ];

    // fetch user groups
    useEffect(() => {
        if(urls.group) {
            fetchUserGroups();
            fetchUsers()
        }
    }, [urls])

    async function fetchUserGroups() {
        const response = await doGetRequest(urls.group, {}, true);
        setUserGroups(response);
    }

    async function fetchUsers() {
        const response = await doGetRequest(urls.user, {}, true);
        setUsers(response);
    }

    function component(type: 'user'|'group') {

        function onClick() {

            setModalData({
                hide: false,
                title: `Create ${type}`,
                type
            });
        }

        function onClickEdit(data: any) {
            console.log('on click edit');
            if(type === 'user') {
                setUserFormData({
                    ...userFormData,
                    data: {
                        ...data,
                        userGroup: data.userGroups.map((grp: {id: string}) => grp.id)
                    }
                });
            }
            else {
                setGroupFormData({
                    ...groupFormData,
                    data
                });
            }
            setModalData({
                hide: false,
                title: `Update ${type}`,
                type
            });
        }

        const columnsForGroups: any = [
            {name: "Name", value: "name"},
            {name: 'Description', value: 'description'},
            {name: 'Edit', value: 'edit', align: 'center'}
        ];

        const columnsForUsers: any = [
            {name: "Username", value: "userName"},
            {name: 'Type', value: 'type'},
            {name: 'Edit', value: 'edit', align: 'center'}
        ];

        const rowForUsers = users.map((user: any) => {
            return {
                ...user,
                edit: <IconButton onClick={() => onClickEdit(user)}>
                        <EditIcon />
                    </IconButton>

            }
        });

        const rowForGroups = userGroups.map((user: any) => {
            return {
                ...user,
                edit: <IconButton onClick={() => onClickEdit(user)}>
                        <EditIcon />
                    </IconButton>

            }
        });

        return (
            <Grid container direction='column'>
                <Grid container justify="flex-end" className='accordian-top'>
                    <Grid item>
                        <CommonButton
                            onClick={onClick}
                            name={`create ${type}`}
                        />
                    </Grid>
                </Grid> 
                
                <Grid className='entries-table' container>
                    <BasicTableMIUI
                        tableName="user groups"
                        rows={type === 'group' ? rowForGroups : rowForUsers}
                        columns={type === 'group' ? columnsForGroups : columnsForUsers}
                    />
                </Grid>
            </Grid>
        );
    }

    function getForm(type: 'user' | 'group') {

        function closeModal() {

            if(type === 'user') fetchUsers();
            else fetchUserGroups();

            handleModalClose();
        }

        async function onSubmitGroup(values: any) {
            let response;
            if(groupFormData && groupFormData.data && groupFormData.data.id) {
                response = await doPutRequest(urls.group, {
                    ...values,
                    id: groupFormData.data.id
                }, true);
            } 
            else {
                response = await doPostRequest(urls.group, values, true);
            }
            if(response && response.errors) {
                setGroupFormData({
                    ...groupFormData,
                    response: response.errors
                });
            }
            else {
                closeModal();
                setGroupFormData({
                    data: undefined
                });
            }
        }

        async function onSubmitUser(values: any) {
            let response;
            if(userFormData && userFormData.data && userFormData.data.id) {
                response = await doPutRequest(urls.user, {
                    ...values,
                    id: userFormData.data.id
                }, true);
            }
            else {

                response = await doPostRequest(urls.user, {
                    ...values,
                    userGroups: values.userGroup,
                    userGroup: undefined
                }, true);
            }
            if(response && response.errors) {
                setUserFormData({
                    ...userFormData,
                    response: response.errors
                });
            }
            else {
                closeModal();
            }
        }

        return (
            <Form 
                getValuesAsObject={true}
                response={type === 'user' ? userFormData?.response : groupFormData?.response}
                className=''
                onSubmit={type === 'user' ? onSubmitUser : onSubmitGroup}
                fields={type === 'user' ? userModelfields : userGroupfields}
            />
        );

    }

    function handleModalClose() {
        setModalData(null);
        setUserFormData(null);
        setGroupFormData(null);
    }

    return (
        <Grid container direction='column' className='users-and-group-container'> 
            <AccordianCommon 
                name={'User model'}
                children={component('user')}
            />
            <AccordianCommon
                name={'User group'}
                children={component('group')}
            />

            <ModalDialog
                title={modalData?.title || 'Save'}
                isOpen={modalData?.hide === false}
                handleClose={handleModalClose}
                children={modalData?.type === 'user' ? getForm('user') : getForm('group')}
            />          


        </Grid>
    )
}

function mapStateToProps(state: RootState) {
    return {
        applicationName: state.authentication.applicationName,
        userGroupUrl: state.routeAddress.routes.auth?.userGroupUrl,
        env: state.authentication.env,
        otherUserUrl: state.routeAddress.routes.auth?.otherUserUrl
    }

}
const connector = connect(mapStateToProps)
export const Users = connector(UsersComponent);
import { Grid } from "@material-ui/core";
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV, SupportedUserType } from "@ranjodhbirkaur/constants";
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
import { doGetRequest, doPostRequest } from "../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../utils/tools";

type PropsFromRedux = ConnectedProps<typeof connector>;
interface ModalDataType {
    hide: boolean;
    title: string;
    type: 'user' | 'group'
}
export const UsersComponent = (props: PropsFromRedux) => {

    const {userGroupUrl, applicationName, env, otherUserUrl} = props;

    const [userGroups, setUserGroups] = useState<{name: string, description: string}[] | null>(null);
    const [users, setUsers] = useState<null>(null);

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
            value: '',
            inputType: TEXT
        },
        {
            name: 'password',
            required: true,
            placeholder: 'Set a password for the user',
            label: 'Password',
            className: '',
            value: '',
            inputType: TEXT
        },
        {
            name: 'type',
            required: true,
            placeholder: 'Select the User type of user',
            label: 'Select the User type of user',
            className: '',
            value: '',
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
            value: '',
            inputType: DROPDOWN,
            options: userGroups && userGroups.length ? userGroups.map((userGroup: any) => {
                return {
                    label: userGroup.name,
                    value: userGroup._id
                }
            }) : []
        },
        
    ];

    const userGroupfields: ConfigField[] = [
        {
            name: 'name',
            required: true,
            placeholder: 'User group name',
            label: 'User group name',
            className: '',
            value: '',
            inputType: TEXT
        },
        {
            name: 'description',
            required: true,
            placeholder: 'Description',
            label: 'Description',
            className: '',
            value: '',
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

        return (
            <Grid container>
                <Grid container justify="space-between">
                <Grid item>
                    <RenderHeading
                        value="user model"
                        className='user-model-heading'
                    />
                </Grid>
                <Grid item>
                    <CommonButton
                        onClick={onClick}
                        name={`create ${type}`}
                     />
                </Grid>
                </Grid> 
                
                <Grid className='entries-table'>
                    <BasicTableMIUI
                        tableName="user groups"
                        rows={type === 'group' ? userGroups || [] : users || []}
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

            setModalData({
                title:'',
                type,
                hide: true
            });
        }

        async function onSubmitGroup(values: any) {
            const response = await doPostRequest(urls.group, values, true);
            setGroupFormData({
                ...groupFormData,
                response
            });
            closeModal();
            
        }

        async function onSubmitUser(values: any) {
            const response = await doPostRequest(urls.user, values, true);
            setGroupFormData({
                ...userFormData,
                response
            });
            closeModal();
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
        setModalData({
            hide: true,
            title: '',
            type: 'user'
        });
    }

    return (
        <Grid>
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
import { Grid } from "@material-ui/core";
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV, SupportedUserType } from "@ranjodhbirkaur/constants";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux"
import { couldStartTrivia } from "typescript";
import { AccordianCommon } from "../../../../components/common/AccordianCommon";
import { CommonButton } from "../../../../components/common/CommonButton";
import { Form } from "../../../../components/common/Form";
import { ConfigField, DROPDOWN, TEXT } from "../../../../components/common/Form/interface";
import { RenderHeading } from "../../../../components/common/RenderHeading";
import { RootState } from "../../../../rootReducer";
import { doGetRequest, doPostRequest } from "../../../../utils/baseApi";
import { getItemFromLocalStorage } from "../../../../utils/tools";

type PropsFromRedux = ConnectedProps<typeof connector>;
export const UsersComponent = (props: PropsFromRedux) => {

    const {userGroupUrl, applicationName, env} = props;

    const [userGroups, setUserGroups] = useState<any>(null);

    const [showCreateUserForm, setShowCreateUserForm] = useState<boolean>(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState<boolean>(false);
    const [urls, setUrls] = useState<{user: string; group: string}>({user: '', group: ''})

    function setSomeUrls() {
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        //debugger
            if(userGroupUrl && clientUserName) {
                const url = userGroupUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName)
                .replace(`:${APPLICATION_NAME}`, applicationName)
                .replace(`:${ENV}`, env);
                setUrls({
                    ...urls,
                    group: url
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
        }
    }, [urls])

    async function fetchUserGroups() {

        const response = await doGetRequest(urls.group, {}, true);
        setUserGroups(response);
        
    }

    function component(type: 'user'|'group') {

        function onClick() {
            if(type === 'user') {
                return () => setShowCreateUserForm(!showCreateUserForm);
            }
            else {
                return () => setShowCreateGroupForm(!showCreateGroupForm);
            }

        }

        async function onSubmit(values: any) {
            const response = await doPostRequest(urls.group, values, true);

        }

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
                {
                    (!(type === 'user' ? showCreateUserForm : showCreateGroupForm))
                    ? <Form 
                    getValuesAsObject={true}
                    response={''}
                    className=''
                    onSubmit={onSubmit}
                    fields={type === "user" ? userModelfields : userGroupfields}
                /> : null
                }
                <Grid className='entries-table'>
                    EntriesTable

                </Grid>
            </Grid>
        );
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
        </Grid>
    )
}

function mapStateToProps(state: RootState) {
    return {
        applicationName: state.authentication.applicationName,
        userGroupUrl: state.routeAddress.routes.auth?.userGroupUrl,
        env: state.authentication.env
    }

}
const connector = connect(mapStateToProps)
export const Users = connector(UsersComponent);
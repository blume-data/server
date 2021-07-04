import { Grid } from '@material-ui/core';
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV } from '@ranjodhbirkaur/constants';
import { useEffect, useState } from 'react';
import { CommonCheckBoxField } from '../../../../../../../components/common/Form/CommonCheckBoxField';
import { doGetRequest, doPostRequest, doPutRequest } from '../../../../../../../utils/baseApi';
import { AUTH_ROUTES, DATA_ROUTES } from '../../../../../../../utils/constants';
import { getItemFromLocalStorage, getUrlSearchParams } from '../../../../../../../utils/tools';
import {Avatar, Chip} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import GroupIcon from '@material-ui/icons/Group';
import { RenderHeading } from '../../../../../../../components/common/RenderHeading';


export interface ModelSettingType {
    id: string,
    isPublic: boolean;
    restrictedUserGroups: {id: string, name: string, description: string}[];
    permittedUserGroups: {id: string, name: string, description: string}[];
}

interface SettingType {
    data: ModelSettingType | null;
    applicationName: string,
    env: string
}

export const ModelSetting = (props: SettingType) => {

    const {env, applicationName, data} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME) || '';
    const [userGroups, setUserGroups] = useState<{
        description: string,
        id: string,
        name: string
    }[]>([]);
    const [setting, setSetting] = useState<ModelSettingType>({
        id: '',
        isPublic: false,
        restrictedUserGroups: [],
        permittedUserGroups: []
    });

    async function createModelSetting() {

        const url = DATA_ROUTES.SettingsUrl
            .replace(`:${ENV}`, env)
            .replace(`:${CLIENT_USER_NAME}`, clientUserName)
            .replace(`:${APPLICATION_NAME}`, applicationName);

        const response = await doPostRequest(url, {}, true);
        if(response && response.id) {
            setSetting({
                ...setting,
                id: response.id
            });
        } 
    }

    function updateSetting(type: 'isPublic' | 'restrictedUserGroups' | 'permittedUserGroups', value: any) {
        console.warn('value', value)
        setSetting({
            ...setting,
            [type]: value
        });
        requestUpdateSetting();
    }

    async function requestUpdateSetting() {

        const url = DATA_ROUTES.SettingsUrl
            .replace(`:${ENV}`, env)
            .replace(`:${CLIENT_USER_NAME}`, clientUserName)
            .replace(`:${APPLICATION_NAME}`, applicationName);

        await doPutRequest(url, {
            ...setting,
            isPublic: !setting.isPublic
        }, true);
    }

    // Create a model setting
    useEffect(() => {

        const modelName = getUrlSearchParams('name');

        if(modelName && data && data.id) {
            if(data.id) {
                setSetting({
                    ...data
                });
            }
        }
        if(!modelName) {
            createModelSetting();
        }
    }, [data]);

    // Fetch User Groups
    useEffect(() => {
        fetchUserGroups();
    }, []);

    async function fetchUserGroups() {
        const url = AUTH_ROUTES.userGroupUrl
            .replace(`:${CLIENT_USER_NAME}`, clientUserName)
            .replace(`:${APPLICATION_NAME}`, applicationName)
            .replace(`:${ENV}`, env);

        const response = await doGetRequest(url, {}, true);
        setUserGroups(response);
        console.log('Response', response);
    }

    function renderPermissions(type: "restrict" | "permitted") {
        return (
            <div className="user-groups">
                <RenderHeading value={`${type === "restrict" ? 'Restricted' : 'Permitted'} UserGroups:`}/>
                {userGroups.map((userGroup, index) => {

                    let disabled = false;
                    const exist = (() => {
                        if(type === "restrict") {
                            const found = setting.restrictedUserGroups.find(ug => ug.id === userGroup.id);
                            const alsoFound = setting.permittedUserGroups.find(ug => ug.id === userGroup.id);
                            if(alsoFound) {
                                disabled = true;
                                return false;
                            }
                            return found;
                        }
                        else {
                            const found =  setting.permittedUserGroups.find(ug => ug.id === userGroup.id);
                            const alsoFound = setting.restrictedUserGroups.find(ug => ug.id === userGroup.id);
                            if(alsoFound) {
                                disabled = true;
                                return false;
                            }
                            return found;
                        }
                    })()

                    function onClickDoneIcon() {
                       if(type === "restrict") {
                            setSetting({
                                ...setting,
                                restrictedUserGroups: [
                                    ...setting.restrictedUserGroups,
                                    userGroup
                                ]
                            });
                       }
                       else {
                        setSetting({
                            ...setting,
                            permittedUserGroups: [
                                ...setting.permittedUserGroups,
                                userGroup
                            ]
                        });
                       }
                    }
                    function onClickRemoveIcon() {
                        if(type === "restrict") {
                            const temp = setting.restrictedUserGroups.filter(ug => ug.id !== userGroup.id);
                            setSetting({
                                ...setting,
                                restrictedUserGroups: temp
                            });
                        }
                        else {
                            const temp = setting.permittedUserGroups.filter(ug => ug.id !== userGroup.id);
                            setSetting({
                                ...setting,
                                permittedUserGroups: temp
                            });
                        }
                    }

                    return (
                        <Chip
                            disabled={disabled}
                            color={exist ? "secondary" : undefined}
                            size="medium"
                            key={index}
                            icon={<GroupIcon />}
                            deleteIcon={exist ? <CloseIcon /> : <DoneIcon />}
                            onDelete={exist ? onClickRemoveIcon : onClickDoneIcon}
                            label={userGroup.name}
                            variant="outlined"
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <Grid className="setting-container">
            <CommonCheckBoxField
                onChange={(e: any) => updateSetting('isPublic', e.target.checked)}
                onBlur={() => {}}
                placeholder=""
                value={(setting.isPublic ? 'true' : 'false')}
                className=""
                required={false}
                name="isPublic"
                label="Is public"
            />

            {renderPermissions('restrict')}
            {renderPermissions('permitted')}

            
        </Grid>
    );
}
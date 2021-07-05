import { Grid } from '@material-ui/core';
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV } from '@ranjodhbirkaur/constants';
import { useEffect, useState } from 'react';
import { CommonCheckBoxField } from '../../../../../../../components/common/Form/CommonCheckBoxField';
import { doGetRequest, doPostRequest, doPutRequest } from '../../../../../../../utils/baseApi';
import { AUTH_ROUTES, DATA_ROUTES } from '../../../../../../../utils/constants';
import { getItemFromLocalStorage, getUrlSearchParams } from '../../../../../../../utils/tools';
import {Chip} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import GroupIcon from '@material-ui/icons/Group';
import { AccordianCommon } from '../../../../../../../components/common/AccordianCommon';
import './style.scss';
import { TextBox } from '../../../../../../../components/common/Form/TextBox';


export interface ModelSettingType {
    id: string | null,
    isPublic: boolean;
    supportedDomains: string[];
    restrictedUserGroups: {id: string, name: string, description: string}[];
    permittedUserGroups: {id: string, name: string, description: string}[];
}

interface SettingType {
    data: ModelSettingType;
    applicationName: string,
    env: string,
    setSetting: (id: ModelSettingType) => void;
    isLoading: boolean;
}

export const ModelSetting = (props: SettingType) => {

    const {env, applicationName, data, setSetting, isLoading} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME) || '';
    const [userGroups, setUserGroups] = useState<{
        description: string,
        id: string,
        name: string
    }[]>([]);

    const setting = data;

    // supported domain
    const [value, setValue] = useState('');

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
        
        const udpatedSetting: ModelSettingType = {
            ...setting,
            [type]: value
        }
        setSetting(udpatedSetting);
        requestUpdateSetting(udpatedSetting);
    }

    async function requestUpdateSetting(updatedSetting: ModelSettingType) {

        // If there is no id no required to update
        if(!setting.id) return;
        const url = DATA_ROUTES.SettingsUrl
            .replace(`:${ENV}`, env)
            .replace(`:${CLIENT_USER_NAME}`, clientUserName)
            .replace(`:${APPLICATION_NAME}`, applicationName);

        await doPutRequest(url, {
            ...setting,
            isPublic: updatedSetting.isPublic,
            restrictedUserGroups: updatedSetting.restrictedUserGroups.map(rg => rg.id),
            permittedUserGroups: updatedSetting.permittedUserGroups.map(rg => rg.id),
            supportedDomains: updatedSetting.supportedDomains
        }, true);
    }

    // Create a model setting
    useEffect(() => {
        const modelName = getUrlSearchParams('name');
        if(modelName && data && data.id) {
            if(data.id && data.id !== null && setting.id !== data.id) {
                setSetting({
                    ...data
                });
            }
        }
        if(!modelName && data.id === null) {
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
    }

    function renderPermissions(type: "restrict" | "permitted") {

        const property = type === "permitted" ? "permittedUserGroups" : "restrictedUserGroups";
        const otherProperty = type === "permitted" ? "restrictedUserGroups" : "permittedUserGroups";

        return (
            <Grid container className="user-groups">
                {userGroups.map((userGroup, index) => {

                    let disabled = !!setting[otherProperty].length;
                    const exist = (() => {
                        const found = setting[property].find(ug => ug.id === userGroup.id);
                        const alsoFound = setting[otherProperty].find(ug => ug.id === userGroup.id);
                        if(alsoFound) {
                            //disabled = true;
                            return false;
                        }   
                        return found ;
                    })();

                    function onClickDoneIcon() {
                        const updatedSetting = {
                            ...setting,
                            [property]: [
                                ...setting[property],
                                userGroup
                            ]
                        };
                        setSetting(updatedSetting);
                        requestUpdateSetting(updatedSetting);
                    }

                    function onClickRemoveIcon() {
                        const temp = setting[property].filter(ug => ug.id !== userGroup.id);
                        const updatedSettting = {
                            ...setting,
                            [property]: temp
                        }
                        setSetting(updatedSettting);
                        requestUpdateSetting(updatedSettting);
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
            </Grid>
        );
    }

    function renderSupportedDomain() {

        function onblur(event: any) {

            const code = (event.keyCode ? event.keyCode : event.which);
            if(code === 13) {
                const t = setting.supportedDomains;
                t.push(event.target.value);

                setValue('');
                const updatedSetting = {
                    ...setting,
                    supportedDomains: t
                };
                setSetting({
                    ...setting,
                    ...updatedSetting
                });
                requestUpdateSetting(updatedSetting);
            }
        }

        return (
            <Grid container className='supported-domain'>
                {
                    setting.supportedDomains.map((supportedDomain, index) => {

                        if(!supportedDomain) return null;

                        function onClickDeleteIcon() {

                            const t = setting.supportedDomains.filter(s => s !== supportedDomain);
                            setSetting({
                                ...setting,
                                supportedDomains: t
                            });
                        }

                        return (
                            <Chip
                                color={"primary"}
                                size="medium"
                                key={index}
                                icon={<GroupIcon />}
                                deleteIcon={<CloseIcon />}
                                onDelete={onClickDeleteIcon}
                                label={supportedDomain}
                                variant="outlined"
                            />
                        );
                    })
                }

                <TextBox
                    type="text"
                    placeholder="Supported domain url"
                    value={value}
                    className=""
                    onChange={(event) => {setValue(event.target.value)}}
                    onBlur={onblur}
                    onKeyDown={onblur}
                    name="supported domain"
                    label="Supported Domain"
                    required={false}
                />


            </Grid>
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

            <AccordianCommon name="Restrict user groups">
                {renderPermissions('restrict')}
            </AccordianCommon>
            
            <AccordianCommon name="Permit user groups">
                {renderPermissions('permitted')}
            </AccordianCommon>

            <AccordianCommon name="Supported domains">
                {renderSupportedDomain()}
            </AccordianCommon>
                        
        </Grid>
    );
}
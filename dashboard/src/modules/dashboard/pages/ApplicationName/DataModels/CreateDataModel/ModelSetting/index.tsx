import { Grid } from '@material-ui/core';
import { APPLICATION_NAME, CLIENT_USER_NAME, ENV } from '@ranjodhbirkaur/constants';
import { useEffect, useState } from 'react';
import { CommonCheckBoxField } from '../../../../../../../components/common/Form/CommonCheckBoxField';
import { doPostRequest, doPutRequest } from '../../../../../../../utils/baseApi';
import { DATA_ROUTES } from '../../../../../../../utils/constants';
import { getItemFromLocalStorage, getUrlSearchParams } from '../../../../../../../utils/tools';


export interface ModelSettingType {
    id: string,
    isPublic: boolean;
    restrictedUserGroups: {_id: string, name: string, description: string}[];
    permittedUserGroups: {_id: string, name: string, description: string}[];
}

interface SettingType {
    data: ModelSettingType | null;
    applicationName: string,
    env: string
}

export const ModelSetting = (props: SettingType) => {

    const {env, applicationName, data} = props;
    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME) || '';
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
        </Grid>
    );
}
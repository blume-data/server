import { Grid } from '@material-ui/core';
import React from 'react';
import { RenderHeading } from '../../../../../../../components/common/RenderHeading';


export interface ModelSettingType {
    isPublic: boolean;
    restrictedUserGroups: {_id: string, name: string, description: string}[];
    permittedUserGroups: {_id: string, name: string, description: string}[];
}

interface SettingType {
    data: ModelSettingType | null;
}

export const ModelSetting = (props: SettingType) => {
    return (
        <Grid>
            <RenderHeading
                value={`Is public: ${!!props.data?.isPublic}`}
            />
        </Grid>
    );
}
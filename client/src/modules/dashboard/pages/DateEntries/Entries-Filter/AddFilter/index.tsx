import React from "react";
import Grid from "@material-ui/core/Grid";
import {SearchMenuList} from "../../../../../../components/common/SearchMenuList";
import {OptionsType} from "../../../../../../components/common/Form/interface";

interface AddFilterTypes {
    rulesOptions: OptionsType[];
    modelName: string;
    onChangePropertiesDropdown: (str: string) => void;
}
export const AddFilter = (props: AddFilterTypes) => {
    const {rulesOptions, modelName, onChangePropertiesDropdown} = props;
    return (
        <Grid className={'add-filter-container'}>
            Add a filter
            <Grid item className="properties-dropdown-wrapper">
                {
                    rulesOptions && rulesOptions.length && modelName
                        ? <SearchMenuList
                            value={''}
                            placeholder={'Model properties'}
                            options={rulesOptions}
                            onMenuChange={onChangePropertiesDropdown}
                        />
                        : null
                }

            </Grid>
        </Grid>
    );
}
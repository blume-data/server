import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {SearchMenuList} from "../../../../../../components/common/SearchMenuList";
import {OptionsType} from "../../../../../../components/common/Form/interface";

interface AddFilterTypes {
    rulesOptions: OptionsType[];
    modelName: string;
}
export const AddFilter = (props: AddFilterTypes) => {
    const {rulesOptions, modelName} = props;

    const [selectedProperty, setSelectedProperty] = useState<string>('');

    // on change properties dropdown
    function onChangePropertiesDropdown(value: string) {
        setSelectedProperty(value);
    }

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
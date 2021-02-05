import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getModelDataAndRules} from "../../../../../utils/tools";
import {DESCRIPTION, DISPLAY_NAME, NAME, RuleType} from "@ranjodhbirkaur/constants";
import './entries-filter.scss';
import {SearchMenuList} from "../../../../../components/common/SearchMenuList";

interface ModelsType {
    [DESCRIPTION]: string;
    [NAME]: string;
    [DISPLAY_NAME]: string;
    _id: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type EntriesFilterComponentType = PropsFromRedux & {
    modelName: string;
    setModelName?: (name: string) => void;
    rules: RuleType[] | null;
}

export const EntriesFilterComponent = (props: EntriesFilterComponentType) => {

    const {applicationName, env, language, GetCollectionNamesUrl, modelName, setModelName, rules } = props;
    const [models, setModels] = useState<ModelsType[]>([]);

    async function fetchModelRulesAndData() {
        if(GetCollectionNamesUrl) {
            const response = await getModelDataAndRules({
                applicationName, language, modelName: '', env, GetCollectionNamesUrl,
                getOnly: `${DESCRIPTION},${NAME},${DISPLAY_NAME}`
            });
            if(response && response.length) {
                setModels(response);
            }
        }
    }

    // Fetch Model Data and Rules
    useEffect(() => {
        fetchModelRulesAndData();
    }, [GetCollectionNamesUrl]);


    const modelOptions = models.map(model => {
        return {
            label: model[DISPLAY_NAME],
            value: model[NAME]
        }
    });

    // on change dropdown
    function onChangeModelDropDown(value: string) {
        if(setModelName) {
            setModelName(value);
        }
        console.log('va', value)
    }

    return (
        <Grid className={'entries-filter-wrapper-container'}>
            <div className="filters-wrapper">
                <div className="model-dropdown-wrapper">
                    <SearchMenuList
                        value={modelName}
                        placeholder={'Filter model'}
                        options={modelOptions}
                        onMenuChange={onChangeModelDropDown}
                    />
                </div>
                <div className="properties-dropdown-wrapper">

                </div>
            </div>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName,
        env: state.authentication.env,
        language: state.authentication.language,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
    }
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getModelDataAndRules} from "../../../../../utils/tools";
import {DESCRIPTION, DISPLAY_NAME, NAME} from "@ranjodhbirkaur/constants";
import {DropDown} from "../../../../../components/common/Form/DropDown";
import './entries-filter.scss';

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
}

export const EntriesFilterComponent = (props: EntriesFilterComponentType) => {

    const {applicationName, env, language, GetEntriesUrl, GetCollectionNamesUrl, modelName, setModelName } = props;
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

    async function getEntries() {
        const response = await fetchModelEntries({
            applicationName, modelName, language, env,
            GetEntriesUrl: GetEntriesUrl ? GetEntriesUrl : ''
        });
        console.log('respnse', response);
    }

    useEffect(() => {
        if(modelName) {
            getEntries();
        }
    }, [modelName, GetEntriesUrl]);

    // Fetch Model Data and Rules
    useEffect(() => {
        fetchModelRulesAndData();
    }, [GetCollectionNamesUrl]);


    const options = models.map(model => {
        return {
            label: model[DISPLAY_NAME],
            value: model[NAME]
        }
    });

    // on change dropdown
    function onChangeDropDown(e: any) {
        const value = e.target.value;
        if(setModelName) {
            setModelName(value);
        }
        console.log('va', value)
    }

    return (
        <Grid className={'entries-filter-wrapper-container'}>
            <div className="wrapper">
                <DropDown
                    label={'Filter model'}
                    className={'model-name-dropdown'}
                    value={modelName}
                    placeholder={'Filter model'}
                    required={false}
                    index={0}
                    options={options}
                    name={'Models'}
                    onChange={onChangeDropDown}
                    onBlur={(e: any) => {}}
                />
            </div>
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        applicationName: state.authentication.applicationName,
        env: state.authentication.env,
        language: state.authentication.language,
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
    }
};

const connector = connect(mapState);
export const EntriesFilter = connector(EntriesFilterComponent);
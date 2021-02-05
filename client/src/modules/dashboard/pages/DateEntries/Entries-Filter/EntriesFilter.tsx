import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {getModelDataAndRules} from "../../../../../utils/tools";
import {DESCRIPTION, DISPLAY_NAME, NAME, RuleType} from "@ranjodhbirkaur/constants";
import './entries-filter.scss';
import {SearchMenuList} from "../../../../../components/common/SearchMenuList";
import {CommonButton} from "../../../../../components/common/CommonButton";
import ModalDialog from "../../../../../components/common/ModalDialog";
import {AddFilter} from "./AddFilter";

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
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    console.log('Rules', rules);

    async function fetchModelRulesAndData(fetchModels = false, getOnly = `${DESCRIPTION},${NAME},${DISPLAY_NAME}`) {
        if(GetCollectionNamesUrl) {
            const response = await getModelDataAndRules({
                applicationName, language,
                modelName: fetchModels ? modelName : '', env, GetCollectionNamesUrl,
                getOnly
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

    const rulesOptions = rules && rules.map(rule => {
        return {
            label: rule[DISPLAY_NAME],
            value: rule[NAME]
        };
    })

    // on change dropdown
    function onChangeModelDropDown(value: string) {
        if(setModelName) {
            setModelName(value);
        }
    }
    // on change properties dropdown
    function onChangePropertiesDropdown(value: string) {
        setSelectedProperty(value);
    }

    // Close filter modal
    function closeFilterModal() {
        setIsModalOpen(false);
    }

    function onClickAddFilter() {
        setIsModalOpen(true);
    }

    return (
        <Grid className={'entries-filter-wrapper-container'}>
            <Grid container justify={"space-between"} className="filters-wrapper">
                <Grid item className="model-dropdown-wrapper">
                    <SearchMenuList
                        value={modelName}
                        placeholder={'Filter model'}
                        options={modelOptions}
                        onMenuChange={onChangeModelDropDown}
                    />
                </Grid>
                <Grid item className="filter-type-wrapper">
                    {
                        modelName ? <CommonButton onClick={onClickAddFilter} name={'Add filter'} /> : null
                    }
                </Grid>

            </Grid>
            <ModalDialog
                title={'Add filter'}
                isOpen={isModalOpen}
                handleClose={closeFilterModal}
                children={<AddFilter
                    rulesOptions={rulesOptions ? rulesOptions : []}
                    onChangePropertiesDropdown={onChangePropertiesDropdown}
                    modelName={modelName}
                />}
            />
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
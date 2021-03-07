import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {RootState} from "../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {fetchModelEntries, getItemFromLocalStorage, getModelDataAndRules, getUrlSearchParams} from "../../../../../utils/tools";
import {
    APPLICATION_NAME,
    BOOLEAN_FIElD_TYPE,
    CLIENT_USER_NAME,
    DATE_AND_TIME_FIElD_TYPE,
    DATE_FIElD_TYPE,
    ErrorMessagesType,
    INTEGER_FIElD_TYPE,
    JSON_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, MULTIPLE_ASSETS_TYPE, ONE_TO_MANY_RELATION,
    REFERENCE_FIELD_TYPE,
    REFERENCE_MODEL_NAME,
    REFERENCE_MODEL_TYPE,
    RuleType,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";
import {doPostRequest, doPutRequest} from "../../../../../utils/baseApi";
import {getBaseUrl} from "../../../../../utils/urls";
import Loader from "../../../../../components/common/Loader";
import {
    ASSETS_ADDER,
    CHECKBOX,
    ConfigField,
    FORMATTED_TEXT,
    JSON_TEXT,
    ONLY_DATE_FORM_FIELD_TYPE,
    REFERENCE_EDITOR,
    TEXT
} from "../../../../../components/common/Form/interface";
import {Form} from "../../../../../components/common/Form";
import {useParams} from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateEntryType = PropsFromRedux & {
    modelNameProp?: string;
    createEntryCallBack?: (id: string) => void;
}

const CreateEntry = (props: CreateEntryType) => {

    const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
    const {env, applicationName, GetCollectionNamesUrl, language, StoreUrl, modelNameProp, createEntryCallBack, GetEntriesUrl} = props;
    const [rules, setRules] = useState<RuleType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState<string | ErrorMessagesType[]>('');
    const [modelData, setModelData] = useState<any>(null);
    // update the entry with the following id
    const [entryId, setEntryId] = useState<string>('');
    const {id} = useParams<{id: string}>();

    // Set model name
    let ModelName = '';
    const {modelName} = useParams<{modelName: string}>();
    if(modelNameProp) {
        ModelName = modelNameProp;
    }
    else {
        ModelName = modelName;
    }

    async function fetchModelDataAndRules() {
        if(GetCollectionNamesUrl && applicationName) {
            const response = await getModelDataAndRules({
                GetCollectionNamesUrl, applicationName, modelName: ModelName, language, env
            });
            if(response && !response.errors && response.length) {
                setRules(JSON.parse(response[0].rules));
            }
            setIsLoading(false);
        }
    }

    // fetch entry data if there is id
    async function fetchEntryData() {
        if(GetEntriesUrl && !modelData && applicationName) {
            const response = await fetchModelEntries({
                env, language, applicationName, modelName: ModelName, GetEntriesUrl, where: {
                    _id: entryId ? entryId : id ? id : undefined
                }
            });
            
            if(response && response.data && response.data.length) {
                setModelData(response.data[0]);
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModelDataAndRules();
    }, [GetCollectionNamesUrl, applicationName]);

    let fields: ConfigField[] = [];

    if(rules) {
        rules.forEach(rule => {

            let inputType = 'text';
            let type = 'text';
            let option: string[] = [];
            let miscData: any = {};
            switch (rule.type) {
                case SHORT_STRING_FIElD_TYPE: {
                    inputType = TEXT;
                    type = 'text';
                    break;
                }
                case LONG_STRING_FIELD_TYPE: {
                    inputType = FORMATTED_TEXT;
                    type = 'text'
                    break;
                }
                case INTEGER_FIElD_TYPE: {
                    inputType = TEXT;
                    type = 'number';
                    break;
                }
                case DATE_FIElD_TYPE: {
                    inputType = ONLY_DATE_FORM_FIELD_TYPE;
                    type = ONLY_DATE_FORM_FIELD_TYPE;
                    break;
                }
                case DATE_AND_TIME_FIElD_TYPE: {
                    inputType = DATE_FIElD_TYPE;
                    type = DATE_FIElD_TYPE;
                    break;
                }
                case BOOLEAN_FIElD_TYPE: {
                    inputType = CHECKBOX;
                    type = TEXT;
                    break;
                }
                case JSON_FIELD_TYPE: {
                    inputType = JSON_TEXT;
                    type = TEXT;
                    break;
                }
                case REFERENCE_FIELD_TYPE: {
                    inputType = REFERENCE_EDITOR;
                    type = TEXT;
                    miscData[REFERENCE_MODEL_TYPE] = rule[REFERENCE_MODEL_TYPE];
                    miscData[REFERENCE_MODEL_NAME] = rule[REFERENCE_MODEL_NAME];
                    break;
                }
                case MEDIA_FIELD_TYPE: {
                    inputType = ASSETS_ADDER;
                    type = TEXT;
                    miscData.assetType = rule.assetsType;
                    break;
                }
            }

            fields.push({
                required: !!rule.required,
                type,
                inputType,
                label: rule.displayName ? rule.displayName : '',
                placeholder: rule.displayName ? rule.displayName : '',
                min: rule.min,
                max: rule.max,
                className: '',
                value: entryId && modelData && modelData[rule.name] ? modelData[rule.name] : '',
                name: rule.name,
                descriptionText: rule.description,
                miscData
            });
        })
    }
    console.log('field', fields, entryId, id)

    // get url string params
    useEffect(() => {
        if(id) {
            setIsLoading(true);
            setEntryId(id);
            fetchEntryData();
        }
    }, [GetEntriesUrl, id, applicationName]);

    async function createEntry(values: any) {
        if(StoreUrl && values && values.length) {
            const url = StoreUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(':modelName', ModelName)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            let data: any = {};

            values.forEach((valueItem: {name: string; value: string}) => {

                function parseValues() {
                    if(valueItem.value) {
                        return valueItem.value.split(',')
                    }
                    else {
                        return undefined;
                    }
                }

                if(rules && rules.length) {
                    const exist = rules.find(rule => rule.name === valueItem.name);
                    if(exist) {
                        // check reference
                        if(exist.type === REFERENCE_FIELD_TYPE && exist[REFERENCE_MODEL_TYPE] === ONE_TO_MANY_RELATION) {
                            data[valueItem.name] = parseValues();
                        }
                        else {
                            data[valueItem.name] = valueItem.value;
                        }

                        // check assets
                        if(exist.type === MEDIA_FIELD_TYPE && exist.assetsType === MULTIPLE_ASSETS_TYPE) {
                            if(exist.assetsType === MULTIPLE_ASSETS_TYPE) {
                            
                                data[valueItem.name] = parseValues();
                            }
                            else {
                                data[valueItem.name] = valueItem.value ? valueItem : undefined;
                            }
                        }
                        if(exist.type === BOOLEAN_FIElD_TYPE) {
                            data[valueItem.name] = valueItem.value === 'true';
                        }
                    }
                }
            });

            let res: any;
            setModelData(data)
            if(entryId) {
                data._id = entryId;
                res = await doPutRequest(`${getBaseUrl()}${url}`, data, true);
            }
            else {
                res = await doPostRequest(`${getBaseUrl()}${url}`, data, true);
            }
            if(createEntryCallBack && res && res.id) {
                createEntryCallBack(res.id);
            }
            
            else if(res && res.id && !entryId) {
                setEntryId(res.id);
            }
            else if(res && res.errors && res.errors.length) {
                setApiResponse(res.errors);
            }
        }
    }

    function onsubmit(values: any) {
        createEntry(values);
    }

    return (
        <Grid>
            {isLoading ? <Loader /> : null}

            <Grid className="create-entry-form-container">
                <Form
                    response={apiResponse}
                    submitButtonName={`Save model ${ModelName}`}
                    className={'create-content-model-form'}
                    fields={fields}
                    showClearButton={true}
                    clearOnSubmit={false}
                    onSubmit={onsubmit}
                    />
            </Grid>

        </Grid>
    );
}


const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        language: state.authentication.language,
        applicationName: state.authentication.applicationName,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
        StoreUrl: state.routeAddress.routes.data?.StoreUrl,
        GetEntriesUrl: state.routeAddress.routes.data?.GetEntriesUrl
    }
};

const connector = connect(mapState);
export default connector(CreateEntry);
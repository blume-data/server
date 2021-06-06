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
    ID,
    INTEGER_FIElD_TYPE,
    JSON_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, MULTIPLE_ASSETS_TYPE, ONE_TO_MANY_RELATION,
    REFERENCE_FIELD_TYPE,
    REFERENCE_MODEL_NAME,
    REFERENCE_MODEL_TYPE,
    RuleType,
    SHORT_STRING_FIElD_TYPE, SINGLE_ASSETS_TYPE
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
import {FileUploadType} from "../../../../../components/common/Form/AssetsAdder";
import {DateTime} from "luxon";

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

    /*Add Initial date for date and time*/
    const [dateAndTimeInit, setDateAndTimeInit] = useState<any>({});

    /*Add initial data for assets with thumbnail urls*/
    const [assetInit, setAssetInit] = useState<FileUploadType[]>([]);

    /*Fields state*/
    const [fields, setFields] = useState<ConfigField[]>([]);


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
                GetCollectionNamesUrl, applicationName, modelName: ModelName, language, env, getOnly:"rules,displayName,id"
            });
            if(response && !response.errors && response.length) {
                setRules(JSON.parse(response[0].rules));
            }
            setIsLoading(false);
        }
    }

    // fetch entry data if there is id
    async function fetchEntryData() {
        if(GetEntriesUrl && !modelData && applicationName && rules && rules.length) {
            const response = await fetchModelEntries({
                env, language, applicationName, modelName: ModelName, GetEntriesUrl, where: {
                    id: entryId ? entryId : id ? id : undefined
                }
            });
            
            if(response && response.data && response.data.length) {
                const newResponse: any = {};
                // check for rules and data
                if(response.data[0]) {
                    for(let prop in response.data[0]) {
                        if(response.data[0].hasOwnProperty(prop)) {

                            const ruleExist = rules && rules.find(rule => {
                                if(rule.name === prop) {
                                    return rule;
                                }
                                return false;
                            });

                            if(ruleExist && ruleExist.type) {
                                switch (ruleExist.type) {
                                    case JSON_FIELD_TYPE: {
                                        if(typeof response.data[0][prop] !== 'string') {
                                            newResponse[prop] = JSON.stringify(response.data[0][prop]);
                                        }
                                        else {
                                            newResponse[prop] = response.data[0][prop];
                                        }
                                        break;

                                    }
                                    case MEDIA_FIELD_TYPE: {
                                        // not array and an object
                                        if(!Array.isArray(response.data[0][prop])) {
                                            newResponse[prop] = response.data[0][prop]._id;
                                            setAssetInit([{
                                                tbU: response.data[0][prop].thumbnailUrl || '',
                                                name: response.data[0][prop].fileName,
                                                id: response.data[0][prop]._id,
                                                type: ''
                                            }]);
                                        }
                                        else {
                                            let ids = '';
                                            const newAssetInit :any = [];
                                            response.data[0][prop].forEach((r: any) => {
                                                if(r._id) {
                                                    ids= ids + (ids ? `,${r._id}` : r._id);
                                                    if(r._id && r.fileName) {
                                                        newAssetInit.push({
                                                            tbU: r.thumbnailUrl || '',
                                                            name: r.fileName,
                                                            id: r._id,
                                                            type: ''
                                                        });
                                                    }
                                                }
                                                else {
                                                    ids= ids + (ids ? `,${r}` : r);
                                                }
                                            });
                                            newResponse[prop] = ids;
                                            setAssetInit(newAssetInit);
                                        }
                                        break;
                                    }
                                    case REFERENCE_FIELD_TYPE: {
                                        debugger
                                        if(!Array.isArray(response.data[0][prop])) {
                                            if(response.data[0][prop]._id) {
                                                newResponse[prop] = response.data[0][prop]._id;
                                            }
                                            else {
                                                newResponse[prop] = response.data[0][prop];
                                            }
                                        }
                                        else {
                                            let ids = '';
                                            response.data[0][prop].forEach((r: any) => {
                                                if(r._id) {
                                                    ids= ids + (ids ? `,${r._id}` : r._id);
                                                }
                                                else {
                                                    ids= ids + (ids ? `,${r}` : r);
                                                }
                                            });
                                            newResponse[prop] = ids;
                                        }
                                        break;
                                    }
                                    case DATE_AND_TIME_FIElD_TYPE: {
                                        const r = `${prop}-timezone`;
                                        const timeStamp = DateTime
                                            .fromISO(response.data[0][prop],
                                            {zone: `${response.data[0][`${prop}-timezone`]}`}).toJSDate();

                                        const old = JSON.parse(JSON.stringify(dateAndTimeInit));
                                        old[prop] = {
                                            timeStamp,
                                            timeZone: response.data[0][r]
                                        }
                                        setDateAndTimeInit(old);
                                        break;
                                    }
                                    case DATE_FIElD_TYPE: {
                                        const timeStamp = DateTime
                                            .fromISO(response.data[0][prop])
                                            .toJSDate();

                                        const old = JSON.parse(JSON.stringify(dateAndTimeInit));
                                        old[prop] = {
                                            timeStamp,
                                        }
                                        setDateAndTimeInit(old);
                                        break;
                                    }
                                    default: {
                                        newResponse[prop] = response.data[0][prop];
                                    }
                                }
                            }
                        }
                    }
                }
                setModelData(newResponse);
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModelDataAndRules();
    }, [GetCollectionNamesUrl, applicationName]);

    // get url string params
    useEffect(() => {
        if(id) {
            setIsLoading(true);
            setEntryId(id);
            fetchEntryData();
        }
    }, [GetEntriesUrl, id, applicationName, rules]);
    
    /*
    * Set Fields state
    * */
    useEffect(() => {
        if(rules) {
            const fieldArray: ConfigField[] = [];
            rules.forEach(rule => {

                let inputType = 'text';
                let type = 'text';
                let option: string[] = [];
                let miscData: any = {};
                let value = ((entryId && modelData && modelData[rule.name]) ? modelData[rule.name] : '');
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
                        if(dateAndTimeInit[rule.name]) {
                            miscData.timeStamp = dateAndTimeInit[rule.name].timeStamp;
                        }
                        break;
                    }
                    case DATE_AND_TIME_FIElD_TYPE: {
                        inputType = DATE_FIElD_TYPE;
                        type = DATE_FIElD_TYPE;
                        if(dateAndTimeInit[rule.name]) {
                            miscData.timeStamp = dateAndTimeInit[rule.name].timeStamp;
                            miscData.timeZone = dateAndTimeInit[rule.name].timeZone;
                        }
                        break;
                    }
                    case BOOLEAN_FIElD_TYPE: {
                        inputType = CHECKBOX;
                        type = TEXT;
                        value = value ? 'true' : 'false';
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
                        miscData.assetInit = assetInit;
                        break;
                    }
                }

                fieldArray.push({
                    required: !!rule.required,
                    type,
                    inputType,
                    label: rule.displayName ? rule.displayName : '',
                    placeholder: rule.displayName ? rule.displayName : '',
                    min: rule.min,
                    max: rule.max,
                    className: '',
                    value,
                    name: rule.name,
                    descriptionText: rule.description,
                    miscData
                });
            });
            setFields(fieldArray);
        }
    }, [rules, modelData, dateAndTimeInit]);

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
                        const splitedValue = valueItem.value.split(',');
                        return splitedValue ? splitedValue : undefined;
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
                        else if(valueItem.value) {
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
                        if(exist.type === JSON_FIELD_TYPE) {
                            data[valueItem.name] = JSON.parse(valueItem.value);
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
                data.id = entryId;
                res = await doPutRequest(`${getBaseUrl()}${url}`, data, true);
            }
            else {
                res = await doPostRequest(`${getBaseUrl()}${url}`, data, true);
            }
            if(createEntryCallBack && res && res[ID]) {
                createEntryCallBack(res[ID]);
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
// @ts-ignore
export default connector(CreateEntry);
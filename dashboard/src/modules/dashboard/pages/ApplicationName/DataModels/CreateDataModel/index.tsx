import React, {useEffect, useState} from "react";
import {Grid, Tooltip} from "@material-ui/core";
import {AlertType, Form} from "../../../../../../components/common/Form";
import {
    ConfigField
} from "../../../../../../components/common/Form/interface";
import {
    BOOLEAN_FIElD_TYPE,
    CLIENT_USER_NAME,
    DATE_FIElD_TYPE,
    DESCRIPTION,
    DISPLAY_NAME,
    ErrorMessagesType,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
    FIELD_MAX,
    FIELD_MIN,
    INTEGER_FIElD_TYPE,
    IS_FIELD_REQUIRED,
    IS_FIELD_UNIQUE,
    JSON_FIELD_TYPE,
    LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE,
    MEDIA_FIELD_TYPE,
    MESSAGE,
    NAME,
    REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE,
    trimCharactersAndNumbers,
    APPLICATION_NAME,
    DATE_AND_TIME_FIElD_TYPE,
    RuleType,
    FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN, SINGLE_ASSETS_TYPE,
} from "@ranjodhbirkaur/constants";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import './style.scss';
import Button from "@material-ui/core/Button";
import Looks3Icon from '@material-ui/icons/Looks3';
import Looks5Icon from '@material-ui/icons/Looks5';
import Looks4Icon from '@material-ui/icons/Looks4';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import CodeIcon from '@material-ui/icons/Code';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {RootState} from "../../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {doGetRequest, doPostRequest, doPutRequest} from "../../../../../../utils/baseApi";
import {getItemFromLocalStorage, getUrlSearchParams} from "../../../../../../utils/tools";
import {dashboardCreateDataModelsUrl, dashboardDataModelsUrl, getBaseUrl} from "../../../../../../utils/urls";
import Loader from "../../../../../../components/common/Loader";
import BasicTableMIUI from "../../../../../../components/common/BasicTableMIUI";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {Alert} from "../../../../../../components/common/Toast";
import {AlertDialog} from "../../../../../../components/common/AlertDialog";
import {useHistory} from "react-router";
import ModalDialog from "../../../../../../components/common/ModalDialog";
import {RenderHeading} from "../../../../../../components/common/RenderHeading";
import {CommonButton} from "../../../../../../components/common/CommonButton";
import {
    FIELD_ONLY_SPECIFIED_VALUES,
    FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
    FIELD_NAME,
    FIELD_ID,
    FIELD_NAME_GROUP,
    FIELD_DESCRIPTION,
    FIELD_ASSET_TYPE,
    FIELD_DEFAULT_VALUE,
    FIELD_PROHIBIT_SPECIFIC_PATTERN,
    FIELD_MATCH_SPECIFIC_PATTERN_STRING,
    FIELD_MATCH_SPECIFIC_PATTERN,
    FIELD_LIMIT_CHARACTER_COUNT_GROUP,
    FIELD_REFERENCE_MODEL_GROUP,
    FIELD_LIMIT_VALUE_GROUP,
    FIELD_DEFAULT_VALUE_GROUP,
    FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
    FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
    FIELD_REFERENCE_MODEL_TYPE,
    FIELD_REFERENCE_MODEL_NAME
} from "./constants";
import {getNameFields, getPropertyFields} from "./fields";

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateDataModelType = PropsFromRedux;

interface FieldData {
    fieldName?: string;
    fieldDescription?: string;
    fieldMax?: string | number;
    fieldMin?: string | number;
    fieldMatchPattern?: string;
    fieldMatchCustomPattern?: string;
    fieldProhibitPattern?: string;
    fieldMinMaxCustomErrorMessage?: string;
    fieldMatchPatternCustomError?: string;
    fieldProhibitPatternCustomError?: string;
    fieldOnlySpecifiedValues?: string;
    fieldDefaultValue?: string;
    fieldDisplayName?: string;
    fieldIsRequired?: string;
    fieldIsUnique?: string;
    fieldIsIndexable?: string;
    fieldAssetsType?: string;
    fieldType?: string;
}

const CreateDataModel = (props: CreateDataModelType) => {

    const [modelNames, setModelNames] = useState<{label: string; value: string}[]>([]);
    const [settingFieldName, setSettingFieldName] = useState<boolean>(false);
    const [addingField, setAddingField] = useState<boolean>(false);

    const [fieldData, setFieldData] = useState<FieldData>({});

    const [fieldEditMode, setFieldEditMode] = useState<boolean>(false);

    const [hideNames, setHideNames] = useState<boolean>(false);

    const [contentModelName, setContentModelName] = useState<string>('');
    const [contentModelDescription, setContentModelDescription] = useState<string>('');
    const [contentModelDisplayName, setContentModelDisplayName] = useState<string>('');
    const [contentModelId, setContentModelId] = useState<string | null>(null);

    const [properties, setProperties] = useState<RuleType[] | null>(null);

    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // to show alerts
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [alert, setAlertMessage] = React.useState<AlertType>({message: ''});
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [deleteEntryName, setDeleteEntryName] = useState<string>('');

    const {
        env, CollectionUrl, applicationName, GetCollectionNamesUrl, language,
    } = props;

    const {
        fieldName='', fieldIsIndexable='', fieldDisplayName='', fieldMatchPattern='', fieldMatchCustomPattern='',
        fieldProhibitPattern='', fieldMax='', fieldMinMaxCustomErrorMessage='', fieldMin='',
        fieldAssetsType='', fieldType='', fieldDefaultValue='', fieldDescription='',
        fieldIsRequired='', fieldIsUnique='', fieldMatchPatternCustomError='', fieldProhibitPatternCustomError='',
        fieldOnlySpecifiedValues=''
    } = fieldData;

    const history = useHistory();

    async function getData() {
        if(GetCollectionNamesUrl && contentModelName) {
            setIsLoading(true);
            const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const response = await doGetRequest(
                `${getBaseUrl()}${url}?name=${contentModelName ? contentModelName : ''}`,
                {},
                true
            );
            if(response && !response.errors && response.length) {
                if(response[0]._id && response[0].name) {
                    const hasUrlParam = getUrlSearchParams('name');
                    if(!hasUrlParam) {
                        history.push(`${dashboardCreateDataModelsUrl}?name=${response[0].name}`);
                    }
                }
                setProperties(JSON.parse(response[0].rules));
                setContentModelDisplayName(response[0].displayName);
                setContentModelDescription(response[0].description);
                setContentModelId(response[0]._id);
            }
            setIsLoading(false);
        }
    }

    async function getCollectionNames() {
        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);

        if(GetCollectionNamesUrl) {
            const url = GetCollectionNamesUrl
                .replace(`:${CLIENT_USER_NAME}`, clientUserName ? clientUserName : '')
                .replace(':env', env)
                .replace(':language', language)
                .replace(`:${APPLICATION_NAME}`,applicationName);

            const fullUrl = `${getBaseUrl()}${url}?get=displayName,name`;
            const response = await doGetRequest(fullUrl, null, true);
            if(response && response.length) {
                const m: {label: string; value: string}[] = [];
                response.forEach((item: {displayName: string; name: string}) => {
                    if(item.name !== contentModelName) {
                        m.push({
                            label: item.displayName,
                            value: item.name
                        });
                    }
                });
                setModelNames(m);
            }
        }
    }

    useEffect(() => {
        getData();
        getCollectionNames();
    }, [GetCollectionNamesUrl, contentModelName]);

    useEffect(() => {
        if(contentModelName) {
            setContentModelName(contentModelName);
        }
        const Name = getUrlSearchParams('name');
        if(Name) {
            setContentModelName(Name);
            setFieldEditMode(true);
        }
    }, []);

    const nameFields: ConfigField[] = getNameFields({
        contentModelDisplayName, contentModelDescription, contentModelName,
    });

    const propertyNameFields = getPropertyFields({
        modelNames,
        fieldAssetsType, fieldName, fieldDisplayName, fieldType, fieldIsIndexable, fieldDescription,
        fieldDefaultValue, fieldEditMode, fieldMax, fieldMin, fieldIsRequired, fieldIsUnique,
        fieldMatchCustomPattern, fieldMatchPattern, fieldMatchPatternCustomError, fieldProhibitPattern,
        fieldMinMaxCustomErrorMessage, fieldProhibitPatternCustomError, fieldOnlySpecifiedValues,
    });

    function onSubmitCreateContentModel(values: object[]) {
        let name = '';
        let displayName = '';
        let description = '';

        values.forEach((value: any) => {
            if(value.name === NAME) {
                name = trimCharactersAndNumbers(value.value);
            }
            else if(value.name === DISPLAY_NAME) {
                displayName = value.value;
            }
            else if(value.name === DESCRIPTION) {
                description = value.value;
            }
        });

        const contentModelName = name ? name : trimCharactersAndNumbers(displayName);
        setContentModelName(contentModelName);
        setContentModelDisplayName(displayName);
        setContentModelDescription(description);
        if(contentModelName) {
            setHideNames(true);
        }
        else {
            // show alert that model name is required
            showAlert('Please add Model name');
        }
    }

    function onSubmitFieldProperty(values: any) {

        if(values && values.length) {

            let propertyId = '';
            let propertyName = '';
            let propertyIsRequired = '';
            let propertyDescription = '';
            let propertyMax = 0;
            let propertyMin = 0;
            let propertyMinMaxCustomErrorMessage = '';
            let propertyIsUnique = '';
            let propertyIsIndexable = '';

            let propertyMatchPattern = '';
            let propertyMatchPatternError = '';

            let propertyMatchCustomPatternErrorMessage = '';

            let propertyProhibitPattern = '';
            let propertyProhibitPatternError = '';

            let propertyMatchPatternString = '';
            let propertyOnlySpecifiedValues = '';
            let propertyDefaultValue = '';
            let propertyReferenceModelName = '';
            let propertyReferenceModelType = '';
            let propertyMediaType = '';
            values.forEach((value: any) => {
                const v = value.value;
                switch (value.name) {
                    case FIELD_ASSET_TYPE: {
                        propertyMediaType = v;
                        break;
                    }
                    case FIELD_DEFAULT_VALUE: {
                        propertyDefaultValue = v;
                        break;
                    }
                    case FIELD_ONLY_SPECIFIED_VALUES: {
                        propertyOnlySpecifiedValues = v;
                        break;
                    }
                    case FIELD_PROHIBIT_SPECIFIC_PATTERN: {
                        propertyProhibitPattern = v;
                        break;
                    }
                    case FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN: {
                        propertyMatchPatternError = v;
                        break;
                    }
                    case FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN: {
                        propertyMatchCustomPatternErrorMessage = v;
                        break;
                    }
                    case FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN: {
                        propertyProhibitPatternError = v;
                        break;
                    }
                    case FIELD_MATCH_SPECIFIC_PATTERN: {
                        propertyMatchPattern = v;
                        break;
                    }
                    case FIELD_MATCH_SPECIFIC_PATTERN_STRING: {
                        propertyMatchPatternString = v;
                        break;
                    }
                    case FIELD_ID: {
                        propertyId = fieldEditMode ? v :  trimCharactersAndNumbers(v);
                        break;
                    }
                    case FIELD_NAME: {
                        propertyName = v;
                        break;
                    }
                    case IS_FIELD_REQUIRED: {
                        propertyIsRequired = v;
                        break;
                    }

                    case FIELD_DESCRIPTION: {
                        propertyDescription = v;
                        break;
                    }
                    case FIELD_MAX: {
                        propertyMax = v;
                        break;
                    }
                    case FIELD_MIN: {
                        propertyMin = v;
                        break;
                    }
                    case FIELD_CUSTOM_ERROR_MSG_MIN_MAX: {
                        propertyMinMaxCustomErrorMessage = v;
                        break;
                    }
                    case 'indexable': {
                        propertyIsIndexable = v;
                        break;
                    }
                    case IS_FIELD_UNIQUE: {
                        propertyIsUnique = v;
                        break;
                    }
                    case FIELD_REFERENCE_MODEL_NAME: {
                        propertyReferenceModelName = v;
                        break;
                    }
                    case FIELD_REFERENCE_MODEL_TYPE: {
                        propertyReferenceModelType = v;
                        break;
                    }
                }
            });

            let isValid = true;
            let errors: {message: string}[] = [];

            /*
            * If field type is reference
            * check if the reference model name and reference model type is present
            * */
            if(fieldType === REFERENCE_FIELD_TYPE) {
                if(!propertyReferenceModelName) {
                    errors.push({
                        message: 'Please add reference model name'
                    });
                    isValid = false;
                }
                if(!propertyReferenceModelType) {
                    errors.push({
                        message: 'Please add reference model type'
                    });
                    isValid = false;
                }
            }

            if(isValid) {
                setTimeout(() => {
                    const property: RuleType = {
                        name: propertyId || trimCharactersAndNumbers(propertyName),
                        displayName: propertyName,
                        required: propertyIsRequired === 'true',
                        type: fieldType,
                        description: propertyDescription,
                        [IS_FIELD_UNIQUE]: propertyIsUnique === 'true',

                        default: propertyDefaultValue ? propertyDefaultValue : undefined,

                        matchSpecificPattern: propertyMatchPattern ? propertyMatchPattern : undefined,
                        [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]: propertyMatchPatternError ? propertyMatchPatternError : undefined,

                        prohibitSpecificPattern: propertyProhibitPattern ? propertyProhibitPattern : undefined,
                        [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]: propertyProhibitPatternError ? propertyProhibitPatternError : undefined,

                        [FIELD_MIN]: propertyMin ? propertyMin : undefined,
                        [FIELD_MAX]: propertyMax ? propertyMax : undefined,
                        [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: propertyMinMaxCustomErrorMessage ? propertyMinMaxCustomErrorMessage : undefined,

                        onlyAllowedValues: propertyOnlySpecifiedValues ? propertyOnlySpecifiedValues : undefined,

                        matchCustomSpecificPattern: propertyMatchPatternString ? propertyMatchPatternString : undefined,
                        [FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN]: propertyMatchCustomPatternErrorMessage ? propertyMatchCustomPatternErrorMessage : undefined,

                        referenceModelName: propertyReferenceModelName ? propertyReferenceModelName : undefined,
                        referenceModelType: propertyReferenceModelType ? propertyReferenceModelType : undefined,

                        assetsType: propertyMediaType ? propertyMediaType : undefined,
                        indexable: !!propertyIsIndexable
                    };

                    const tempProperties = JSON.parse(JSON.stringify(properties ? properties : []));
                    const exist = tempProperties.find((item: any) => item.name === property.name);

                    if(exist) {
                        const newProperties: RuleType[] = tempProperties.map((propertyItem: RuleType) => {
                            if(property.name === propertyItem.name) {
                                return property;
                            }
                            else {
                                return propertyItem;
                            }
                        });
                        setProperties(newProperties);
                    }
                    else {
                        tempProperties.push(property);
                        setProperties(tempProperties);
                    }

                    closeAddFieldForm();
                });
            }
            else {
                setResponse(errors);
            }
        }
    }

    function onClickAddFields() {
        setAddingField(true);
        setHideNames(true);
    }

    /*
    * Show message alert
    * */
    function showAlert(message: string, severity?: 'error' | 'success' | 'info') {
        if(!severity) {
            severity = 'error';
        }
        setTimeout(() => {
            setIsAlertOpen(true);
            setAlertMessage({
                message,
                severity
            });
        }, 10);
    }

    /*Clear Alert*/
    function clearAlert() {
        setTimeout(() => {
            setIsAlertOpen(false);
            setAlertMessage({
                message: ''
            });
        }, 3000);
    }

    async function onClickSaveDataModel() {

        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        // validate
        if(!contentModelDisplayName) {
            setIsAlertOpen(true);
            setAlertMessage({
                message: 'Please add model name',
                severity: "error"
            });
            clearAlert();
            return;
        }

        if(CollectionUrl && clientUserName && properties && properties.length) {
            const url = CollectionUrl
                .replace(':clientUserName', clientUserName)
                .replace(':env', env)
                .replace(':applicationName', applicationName);

            let response;

            if(contentModelId) {
                response = await doPutRequest(`${getBaseUrl()}${url}`, {
                    name: contentModelName,
                    displayName: contentModelDisplayName,
                    description: contentModelDescription,
                    rules: properties,
                    id: contentModelId
                }, true);
                setResponse(response);
            }
            else {
                response = await doPostRequest(`${getBaseUrl()}${url}`, {
                    name: contentModelName,
                    displayName: contentModelDisplayName,
                    description: contentModelDescription,
                    rules: properties
                }, true);
                setResponse(response);
            }

            if(response && !response.errors) {
                const url = dashboardDataModelsUrl.replace(`:${APPLICATION_NAME}`, applicationName);
                history.push(url);
            }
            else if(response.errors && response.errors.length) {
                setIsAlertOpen(true);
                let message = '';
                response.errors.map((errorItem: ErrorMessagesType, index: number) => {
                    return message+=`${index + 1}: ${errorItem[MESSAGE]} \n`
                });
                setAlertMessage({
                    message,
                    severity: "error"
                });
            }
        }
        else if(!properties || !properties.length) {
            setIsAlertOpen(true);
            setAlertMessage({
                message: 'Please add fields',
                severity: "error"
            });
            clearAlert();
        }
    }

    /*Handle click on cancel add field*/
    function onClickCancelAddField() {
        setAddingField(false);
    }

    function fieldItem(name: string, description: string, Icon: JSX.Element, value: string) {

        function onClick() {
            setFieldData({
                ...fieldData,
                fieldType: value
            });
            setAddingField(false);
            setSettingFieldName(true);
        }


        return (
            <Tooltip title={description}>
            <Paper onClick={onClick} className='paper-field-item'>
                <Grid className={'field-item'} >
                    <Button>
                        {Icon}
                        <h2>{name}</h2>
                        <p>{description}</p>
                    </Button>
            </Grid>
            </Paper>
            </Tooltip>
        );
    }

    function renderNameSection() {

        function onClick() {
            // turn off fields
            // turn off setting fields property
            // open name form
            setSettingFieldName(false);
            setAddingField(false);
            setHideNames(false);
        }

        return (
            <Grid container justify={"flex-start"} className="name-section-container">
                <Grid item className={'text-container'}>
                    <RenderHeading
                        type={'primary'}
                        className={'model-display-name'}
                        value={contentModelDisplayName ? contentModelDisplayName : 'untitled model'}
                    />
                    {
                        contentModelDescription ?
                            <RenderHeading
                                type={"secondary"}
                                className={'model-description'}
                                value={contentModelDescription}
                            />
                            : null
                    }
                </Grid>
                <Grid item className={'edit-button'}>
                    <Tooltip title={`Edit model ${contentModelDisplayName}`}>
                        <IconButton onClick={onClick}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                </Grid>
            </Grid>
        )
    }

    function onClickDeleteProperty(propertyName: string) {
        if(properties) {
            const tempProperties = properties.filter(propertyItem => {
                return propertyItem.name !== propertyName;

            });
            setProperties(tempProperties);
        }
    }

    function renderPropertiesSection() {

        const tableRows = [
            {name: 'Name', value: DISPLAY_NAME},
            {name: 'Description', value: DESCRIPTION},
            {name: 'Type', value: 'type'},
            {name: 'Edit', value: 'edit', onClick: true},
            {name: 'Delete', value: 'delete', onClick: true}
        ];

        function openConfirmAlert(property: RuleType) {
            setDeleteEntryName(property.name);
            setConfirmDialogOpen(true);
        }

        function onClickEdit(property: RuleType) {

            setTimeout(() => {

                setSettingFieldName(true);
                setAddingField(false);
                setFieldEditMode(true);
                setFieldData({
                    ...fieldData,
                    fieldType: property.type,
                    fieldDisplayName: property.displayName,
                    fieldName: property.name,
                    fieldDescription: property.description,
                    fieldIsRequired: property.required ? 'true' : 'false',
                    fieldIsUnique: property.unique ? 'true' : 'false',
                    fieldIsIndexable: property.indexable ? 'true' : 'false',
                    fieldDefaultValue: (() => {
                        if(property.type === BOOLEAN_FIElD_TYPE) {
                            return property.default === 'true' ? 'true' : 'false'
                        }
                        else {
                            return property.default || '';
                        }
                    })(),
                    fieldAssetsType: (() => {
                        if(property.type === MEDIA_FIELD_TYPE) {
                            return property.assetsType || '';
                        }
                    })(),
                    fieldMax: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE || property.type === INTEGER_FIElD_TYPE) {
                            return property.max || '';
                        }
                    })(),
                    fieldMin: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE || property.type === INTEGER_FIElD_TYPE) {
                            return property.min || '';
                        }
                    })(),
                    fieldMinMaxCustomErrorMessage: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE || property.type === INTEGER_FIElD_TYPE) {
                            return property[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] || '';
                        }
                    })(),
                    fieldOnlySpecifiedValues: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE || property.type === INTEGER_FIElD_TYPE) {
                            return property.onlyAllowedValues || '';
                        }
                    })(),
                    fieldMatchPattern: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE) {
                            return property.matchSpecificPattern || '';
                        }
                    })(),
                    fieldMatchCustomPattern: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE) {
                            return property.matchCustomSpecificPattern || '';
                        }
                    })(),
                    fieldProhibitPattern: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE) {
                            return property.prohibitSpecificPattern || '';
                        }
                    })(),
                    fieldMatchPatternCustomError: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE) {
                            return property[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN] || '';
                        }
                    })(),
                    fieldProhibitPatternCustomError: (() => {
                        if(property.type === SHORT_STRING_FIElD_TYPE) {
                            return property[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN] || '';
                        }
                    })(),
                });
            });

        }

        const rows = properties && properties.map(property => {
            return {
                ...property,
                edit: <IconButton><EditIcon /></IconButton>,
                delete: <IconButton><DeleteIcon /></IconButton>,
                'delete-click': () => openConfirmAlert(property),
                'edit-click': () => onClickEdit(property),
            }
        })

        return (
            <Grid container direction={"column"} className={'property-section-container'}>
                {
                    properties && properties.length ? <BasicTableMIUI
                        rows={rows}
                        columns={tableRows}
                        tableName={'Fields'}
                    /> : addingField
                        ? null
                        : <RenderHeading className={'no-fields-added'} type={"primary"} value={'No fields added'} />
                }
            </Grid>
        );
    }

    /*Close the form of fields properties*/
    function closeAddFieldForm() {
        setFieldData({});
        setFieldEditMode(false);
        setSettingFieldName(false);
    }

    function renderAddFieldsAndSaveModelButtonGroup() {
        if(contentModelDisplayName) {
            return (
                <ButtonGroup className={'modal-action-buttons'}>
                    <CommonButton
                        name={'Add Fields'}
                        onClick={onClickAddFields}
                        color={"secondary"}
                        variant={"contained"}
                        //title={'Add Fields'}
                    />
                    {
                        properties && properties.length
                            ? <CommonButton
                                name={'Save Model'}
                                //title={'Save Model'}
                                onClick={onClickSaveDataModel}
                                color={"primary"}
                                variant={"contained"}
                               />
                            : null
                    }
                </ButtonGroup>
            );
        }
        return null;

    }

    return (
        <Grid container className={'create-data-model-container'}>
            {
                isLoading ? <Loader /> :  null
            }

            <RenderHeading
                className={'main-heading'}
                type={"main"}
                value={`${fieldEditMode || contentModelId ? 'Edit' : 'Create'} Model`}
            />
            <Paper className={'model-name-container'}>
                {renderNameSection()}
            </Paper>
            <Grid container className="create-model-container">
                <Grid item className="create-content-model">
                    <Paper className={'paper'}>
                        <Grid>
                            {
                                contentModelDisplayName
                                    ? renderPropertiesSection()
                                    : <RenderHeading
                                        className={'add-name-heading'}
                                        value={'Please add name of the model'}
                                        type={'secondary'}
                                    />
                            }
                        </Grid>

                        {
                            addingField
                                ? <Grid container  className="fields-container">

                                    <Grid container justify={"space-between"}>
                                        <Grid item>
                                            <RenderHeading
                                                className='field-heading-container'
                                                type={"primary"}
                                                value={'Add new field'}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Grid container justify={"center"} direction={"column"}>
                                                <CommonButton
                                                    className={'cancel-button'}
                                                    variant={'outlined'}
                                                    name={'Cancel'}
                                                    onClick={onClickCancelAddField}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid spacing={1} container justify={"center"} className="fields-grid">
                                        {fieldItem('Formatted Text', 'customised text with links and media', <TextFieldsIcon />, LONG_STRING_FIELD_TYPE)}
                                        {fieldItem('Text','names, paragraphs, title', <TextFieldsIcon />, SHORT_STRING_FIElD_TYPE)}
                                        {fieldItem('Number', 'numbers like age, count, quantity', <Grid className={'numbers'}>
                                            <Looks3Icon />
                                            <Looks4Icon />
                                            <Looks5Icon />
                                        </Grid>, INTEGER_FIElD_TYPE )}
                                        {fieldItem('Date', 'only date, years, months, days', <DateRangeIcon />, DATE_FIElD_TYPE)}
                                        {fieldItem('Date and time', 'date with time, days, hours, events', <AccessTimeIcon />, DATE_AND_TIME_FIElD_TYPE)}
                                        {fieldItem('Location', 'coordinates', <LocationOnIcon />, LOCATION_FIELD_TYPE)}
                                        {fieldItem('Boolean', 'true or false', <ToggleOffIcon />, BOOLEAN_FIElD_TYPE)}
                                        {fieldItem('Json', 'json data', <CodeIcon />, JSON_FIELD_TYPE)}
                                        {fieldItem('Media', 'videos, photos, files', <PermMediaIcon />, MEDIA_FIELD_TYPE)}
                                        {fieldItem('Reference', 'For example a comment can refer to authors', <LinkIcon />, REFERENCE_FIELD_TYPE)}
                                    </Grid>

                                </Grid>
                                : settingFieldName
                                ? null
                                : renderAddFieldsAndSaveModelButtonGroup()
                        }

                        {
                            settingFieldName
                                ? <Paper>
                                    <Grid container direction={'column'} className={'set-fields-property-container'}>
                                        <Grid item className={'cancel-button-container'}>
                                            <Button onClick={closeAddFieldForm}>Cancel</Button>
                                        </Grid>
                                        <Grid item>
                                            <Form
                                                groups={
                                                    [
                                                        FIELD_NAME_GROUP,
                                                        FIELD_LIMIT_CHARACTER_COUNT_GROUP,
                                                        FIELD_LIMIT_VALUE_GROUP,
                                                        FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
                                                        FIELD_DEFAULT_VALUE_GROUP,
                                                        FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
                                                        FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
                                                        FIELD_REFERENCE_MODEL_GROUP
                                                    ]
                                                }
                                                response={response}
                                                submitButtonName={'Save field'}
                                                onSubmit={onSubmitFieldProperty}
                                                fields={propertyNameFields()}
                                                className={'field-property-form'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                                : null
                        }
                    </Paper>
                </Grid>
            </Grid>
            <AlertDialog
                onClose={() => {
                    setConfirmDialogOpen(false);
                    setDeleteEntryName('');
                }}
                open={confirmDialogOpen}
                onConfirm={() => {
                    onClickDeleteProperty(deleteEntryName);
                    setDeleteEntryName('');
                    setConfirmDialogOpen(false);
                }}
                onCancel={() => {
                    setConfirmDialogOpen(false);
                    setDeleteEntryName('');
                }}
                title={'Confirm Delete'}
                subTitle={'Please confirm if you want to delete'}
            />
            <Alert
                isAlertOpen={isAlertOpen}
                onAlertClose={setIsAlertOpen}
                severity={alert.severity}
                message={alert.message} />
            <ModalDialog
                title={`${fieldEditMode || contentModelId ? 'Edit' : 'Create new'} Model`}
                isOpen={!hideNames}
                handleClose={() => setHideNames(true)}
                children={
                    <Form
                        response={response}
                        submitButtonName={'Save model name'}
                        className={'create-content-model-form'}
                        fields={nameFields}
                        showClearButton={true}
                        onSubmit={onSubmitCreateContentModel}
                    />
                }
            />

        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        applicationName: state.authentication.applicationName,
        language: state.authentication.language,
        CollectionUrl: state.routeAddress.routes.data?.CollectionUrl,
        GetCollectionNamesUrl: state.routeAddress.routes.data?.GetCollectionNamesUrl,
    }
};

const connector = connect(mapState);
export default connector(CreateDataModel);

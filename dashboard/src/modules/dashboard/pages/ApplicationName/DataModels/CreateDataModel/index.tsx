import React, {useEffect, useState} from "react";
import {Grid, Tooltip} from "@material-ui/core";
import {AlertType, Form} from "../../../../../../components/common/Form";
import {
    CHECKBOX,
    ConfigField, DATE_FORM_FIELD_TYPE,
    DROPDOWN,
    FORMATTED_TEXT,
    TEXT, ONLY_DATE_FORM_FIELD_TYPE
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
    EmailRegName,
    UrlRegName,
    DateUsRegName,
    DateEuropeRegName,
    HhTimeRegName,
    HHTimeRegName,
    UsPhoneRegName,
    UsZipRegName,
    emailReg,
    urlReg,
    dateUsReg,
    dateEuropeReg,
    hhTimeReg,
    HHTimeReg,
    usPhoneReg,
    usZipReg,
    APPLICATION_NAME,
    DATE_AND_TIME_FIElD_TYPE,
    ONE_TO_ONE_RELATION,
    ONE_TO_MANY_RELATION,
    RuleType,
    FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN, SINGLE_ASSETS_TYPE, MULTIPLE_ASSETS_TYPE
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

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateDataModelType = PropsFromRedux;

const CreateDataModel = (props: CreateDataModelType) => {

    const [modelNames, setModelNames] = useState<{label: string; value: string}[]>([]);
    const [settingFieldName, setSettingFieldName] = useState<boolean>(false);
    const [addingField, setAddingField] = useState<boolean>(false);

    const [fieldName, setFieldName] = useState<string>('');
    const [fieldDescription, setFieldDescription] = useState<string>('');
    const [fieldMax, setFieldMax] = useState<number | string>('');
    const [fieldMin, setFieldMin] = useState<number | string>('');
    const [fieldMatchPattern, setFieldMatchPattern] = useState<string>('');
    const [fieldMatchCustomPattern, setFieldMatchCustomPattern] = useState<string>('');
    const [fieldProhibitPattern, setFieldProhibitPattern] = useState<string>('');
    const [fieldMinMaxCustomErrorMessage, setFieldMinMaxCustomErrorMessage] = useState<string>('');
    const [fieldMatchPatternCustomError, setFieldMatchPatternCustomError] = useState<string>('');
    const [fieldProhibitPatternCustomError, setFieldProhibitPatternCustomError] = useState<string>('');
    const [fieldOnlySpecifiedValues, setFieldOnlySpecifiedValues] = useState<string>('');
    const [fieldDefaultValue, setFieldDefaultValue] = useState<string>('');
    const [fieldDisplayName, setFieldDisplayName] = useState<string>('');
    const [fieldIsRequired, setFieldIsRequired] = useState<string>('');
    const [fieldIsUnique, setFieldIsUnique] = useState<string>('');
    const [fieldAssetsType, setFieldAssetsType] = useState<string>(SINGLE_ASSETS_TYPE);
    const [fieldType, setFieldType] = useState<string>('');

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

    const FIELD_NAME = 'fieldName';
    const MIN_VALUE = 1;
    const MAX_VALUE = 100;
    const FIELD_DESCRIPTION = 'fieldDescription';
    const FIELD_ID = 'fieldId';
    const FIELD_MATCH_SPECIFIC_PATTERN_STRING = 'matchSpecificPatternString';
    const FIELD_ONLY_SPECIFIED_VALUES = 'onlyAllowedValues';
    const FIELD_DEFAULT_VALUE = 'default';

    const FIELD_MATCH_SPECIFIC_PATTERN = 'matchSpecificPattern';
    const FIELD_PROHIBIT_SPECIFIC_PATTERN = 'prohibitSpecificPattern';
    const FIELD_REFERENCE_MODEL_NAME = 'referenceModelName';
    // one to many or one to one
    const FIELD_REFERENCE_MODEL_TYPE = 'referenceModelType';
    // type of assets field
    const FIELD_ASSET_TYPE = 'assetsType';

    /*Field Group Names*/
    const FIELD_LIMIT_CHARACTER_COUNT_GROUP = 'Limit character count';
    const FIELD_LIMIT_VALUE_GROUP = 'Limit value';
    const FIELD_NAME_GROUP = 'Name';
    const FIELD_MATCH_SPECIFIC_PATTERN_GROUP = 'Match specific pattern';
    const FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP = 'Prohibit specific pattern';
    const FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP = 'Accept only specific values';
    const FIELD_DEFAULT_VALUE_GROUP = 'Default value';
    const FIELD_REFERENCE_MODEL_GROUP = 'Reference model name';

    const {
        env, CollectionUrl, applicationName, GetCollectionNamesUrl, language,
    } = props;

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

    const nameFields: ConfigField[] = [
        {
            required: true,
            placeholder: 'Name',
            value: contentModelDisplayName,
            className: 'create-content-model-name',
            type: 'text',
            name: DISPLAY_NAME,
            label: 'Name',
            inputType: TEXT,
            descriptionText: 'name of the model',
            min: MIN_VALUE,
            max: MAX_VALUE
        },
        {
            min: MIN_VALUE,
            max: MAX_VALUE,
            required: false,
            placeholder: 'Name Identifier',
            value: contentModelName,
            className: 'create-content-model-name-identifier',
            type: 'text',
            name: NAME,
            disabled: !!contentModelName,
            label: 'Name Identifier',
            descriptionText: 'Generated from name (uniquely identify model)',
            inputType: TEXT,
        },
        {
            required: false,
            placeholder: 'Description',
            value: contentModelDescription,
            className: 'create-content-model-description',
            type: 'text',
            name: DESCRIPTION,
            label: 'Description',
            inputType: TEXT,
            min: MIN_VALUE,
            max: MAX_VALUE,
            descriptionText: 'Description of the model'
        },
    ];

    const propertyNameFields = () => {

        const hello: ConfigField[] = [
            // field name
            {
                required: true,
                placeholder: 'Field Name',
                value: fieldDisplayName,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_NAME,
                min: MIN_VALUE,
                max: MAX_VALUE,
                label: 'Field Name',
                inputType: TEXT,
                descriptionText: 'Name of the field',
                groupName: FIELD_NAME_GROUP
            },
            // field id
            {
                disabled: fieldEditMode,
                required: false,
                placeholder: 'Field Identifier',
                value: fieldName,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_ID,
                label: 'Field Identifier',
                inputType: TEXT,
                min: MIN_VALUE,
                max: MAX_VALUE,
                descriptionText: 'Generated from name (uniquely identify field)',
                groupName: FIELD_NAME_GROUP
            },
            // field description
            {
                required: false,
                placeholder: 'Field description',
                value: fieldDescription,
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_DESCRIPTION,
                label: 'Field description',
                inputType: TEXT,
                min: MIN_VALUE,
                max: MAX_VALUE,
                descriptionText: 'Description of field',
                groupName: FIELD_NAME_GROUP
            },
            // field is required
            {
                required: false,
                placeholder: 'Is required',
                value: fieldIsRequired,
                className: 'is-required-check-box',
                name: IS_FIELD_REQUIRED,
                label: 'Is required',
                inputType: CHECKBOX,
                descriptionText: 'You won\'t be able to publish an entry if this field is empty',
                groupName: FIELD_NAME_GROUP
            }
        ];

        // field is unique
        if(![DATE_FIElD_TYPE, JSON_FIELD_TYPE, REFERENCE_FIELD_TYPE, FORMATTED_TEXT, MEDIA_FIELD_TYPE].includes(fieldType)) {
            hello.push({
                required: false,
                placeholder: 'Is unique',
                value: fieldIsUnique,
                className: 'is-unique-check-box',
                name: IS_FIELD_UNIQUE,
                label: 'Is unique',
                inputType: CHECKBOX,
                descriptionText: 'You won\'t be able to publish an entry if there is an existing entry with identical content\n',
                groupName: FIELD_NAME_GROUP
            });
        }

        // Allow only specific pattern and prohibit a specific pattern
        if(fieldType === SHORT_STRING_FIElD_TYPE) {

            // select allowed pattern
            hello.push({
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
                required: false,
                placeholder: 'Match a specific pattern',
                value: `${fieldMatchPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN,
                label: 'Match a specific pattern',
                options:[
                    {label: `Email (${emailReg})`, value: EmailRegName},
                    {label: `Url (${urlReg})`, value: UrlRegName},
                    {label: `Date US (${dateUsReg})`, value: DateUsRegName},
                    {label: `Date European (${dateEuropeReg})`, value: DateEuropeRegName},
                    {label: `12h Time (${hhTimeReg})`, value: HhTimeRegName},
                    {label: `24h Time (${HHTimeReg})`, value: HHTimeRegName},
                    {label: `Us phone number (${usPhoneReg})`, value: UsPhoneRegName},
                    {label: `Us zip code (${usZipReg})`, value: UsZipRegName}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Make this field match a pattern: e-mail address, URI, or a custom regular expression'
            });
            // allowed custom pattern
            hello.push({
                required: false,
                placeholder: 'Match a custom specific pattern',
                value: `${fieldMatchCustomPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN_STRING,
                label: 'Match a custom specific pattern',
                inputType: TEXT,
                descriptionText: 'Make this field match a custom regular expression',
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
            });

            // allowed pattern custom error message
            hello.push({
                required: false,
                placeholder: 'Match specific pattern custom error message',
                value: `${fieldMatchPatternCustomError}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
                label: 'Match specific pattern custom error message',
                inputType: TEXT,
                descriptionText: 'This message will be sent if the value does not match pattern',
                groupName: FIELD_MATCH_SPECIFIC_PATTERN_GROUP,
            });

            // prohibit pattern
            hello.push({
                required: false,
                placeholder: 'Prohibit a specific pattern',
                value: `${fieldProhibitPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_PROHIBIT_SPECIFIC_PATTERN,
                label: 'Prohibit a specific pattern',
                inputType: TEXT,
                groupName: FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
                descriptionText: 'Make this field invalid when a pattern is matched: custom regular expression (e.g. bad word list)'
            });

            // prohibit pattern custom error message
            hello.push({
                required: false,
                placeholder: 'Prohibit specific pattern custom error message',
                value: `${fieldProhibitPatternCustomError}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_CUSTOM_ERROR_MSG_MATCH_CUSTOM_PATTERN,
                label: 'Prohibit specific pattern custom error message',
                inputType: TEXT,
                descriptionText: 'Custom message will be sent if the value matches this pattern',
                groupName: FIELD_PROHIBIT_SPECIFIC_PATTERN_GROUP,
            });
        }

        // Default Value field
        if(fieldType !== REFERENCE_FIELD_TYPE && fieldType !== JSON_FIELD_TYPE) {
            let inputType = '';
            let placeholder = 'Default value';
            let type = 'string';
            switch (fieldType) {
                case INTEGER_FIElD_TYPE:{
                    type = 'number';
                    inputType = TEXT;
                    break;
                }
                case LONG_STRING_FIELD_TYPE: {
                    inputType = FORMATTED_TEXT;
                    break;
                }
                case BOOLEAN_FIElD_TYPE: {
                    inputType = CHECKBOX;
                    placeholder = 'true';
                    break;
                }
                case DATE_AND_TIME_FIElD_TYPE: {
                    inputType = DATE_FORM_FIELD_TYPE;
                    placeholder = 'Default Date';
                    type = DATE_AND_TIME_FIElD_TYPE;
                    break;
                }
                case DATE_FIElD_TYPE: {
                    inputType = ONLY_DATE_FORM_FIELD_TYPE;
                    placeholder = 'Default Date';
                    type = ONLY_DATE_FORM_FIELD_TYPE
                    break;
                }
                default: {
                    inputType = TEXT;
                    break;
                }
            }
            hello.push({
                required: false,
                placeholder: placeholder,
                value: fieldDefaultValue,
                className: '',
                name: 'default',
                label: placeholder,
                type,
                inputType,
                descriptionText: 'Default value if the field is left blank',
                groupName: FIELD_DEFAULT_VALUE_GROUP
            });
        }

        // Min max and only allowed values
        if(fieldType === SHORT_STRING_FIElD_TYPE || fieldType === INTEGER_FIElD_TYPE) {
            // Max count
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                value: `${fieldMax}`,
                className: 'field-max-count',
                type: 'number',
                name: FIELD_MAX,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                inputType: TEXT,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a maximum allowed number of characters' : 'Specify a maximum allowed value'
            });
            // Min count
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                value: `${fieldMin}`,
                className: 'field-min-count',
                type: 'number',
                name: FIELD_MIN,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                inputType: TEXT,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a minimum allowed number of characters' : 'Specify a minimum allowed value'
            });
            // Max Min Custom count
            hello.push({
                required: false,
                placeholder: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                value: `${fieldMinMaxCustomErrorMessage}`,
                className: 'field-custom-error-message',
                type: 'text',
                name: FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
                groupName: fieldType === SHORT_STRING_FIElD_TYPE ? FIELD_LIMIT_CHARACTER_COUNT_GROUP : FIELD_LIMIT_VALUE_GROUP,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                descriptionText: `Specify a custom error message if ${fieldType === SHORT_STRING_FIElD_TYPE ? 'characters are' : 'value is'} not within specified range`,
                inputType: TEXT
            });
            // only allowed values
            hello.push({
                required: false,
                placeholder: 'Accept only specified values',
                value: `${fieldOnlySpecifiedValues}`,
                className: 'field-min-count',
                type: 'text',
                name: FIELD_ONLY_SPECIFIED_VALUES,
                label: 'Accept only specified values',
                inputType: TEXT,
                groupName: FIELD_ALLOW_ONLY_SPECIFIC_VALUES_GROUP,
                descriptionText: 'An entry won\'t be valid if the field value is not in the list of specified values (Add values separated by comma)'
            });
        }

        if(fieldType === REFERENCE_FIELD_TYPE) {

            hello.push({
                groupName: FIELD_REFERENCE_MODEL_GROUP,
                required: false,
                placeholder: 'Select reference model name',
                value: ``,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_REFERENCE_MODEL_NAME,
                label: 'Select reference model name',
                options: modelNames,
                inputType: DROPDOWN,
                descriptionText: 'Select a model name to add reference to'
            });
            hello.push({
                groupName: FIELD_REFERENCE_MODEL_GROUP,
                required: false,
                placeholder: 'Select type of reference',
                value: ``,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_REFERENCE_MODEL_TYPE,
                label: 'Select type of reference',
                options: [
                    {label: 'one to one relation', value: ONE_TO_ONE_RELATION},
                    {label: 'one to many relation', value: ONE_TO_MANY_RELATION}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Select type of reference'
            });
        }

        if(fieldType === MEDIA_FIELD_TYPE) {
            hello.push({
                groupName: FIELD_NAME_GROUP,
                required: false,
                placeholder: 'Select type of media storage',
                value: fieldAssetsType,
                className: 'field-min-count',
                type: TEXT,
                name: FIELD_ASSET_TYPE,
                label: 'Select type of reference',
                options: [
                    {label: 'single media', value: SINGLE_ASSETS_TYPE},
                    {label: 'multiple media', value: MULTIPLE_ASSETS_TYPE}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Select type of media storage'
            })
        }

        return hello;
    };

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

                        assetsType: propertyMediaType ? propertyMediaType : undefined
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
            setFieldType(value);
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
                        title={'Model name'}
                        className={'model-display-name'}
                        value={contentModelDisplayName ? contentModelDisplayName : 'untitled model'}
                    />
                    {
                        contentModelDescription ?
                            <RenderHeading
                                type={"secondary"}
                                className={'model-description'}
                                title={'model-description'}
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

            setFieldType(property.type);
            setTimeout(() => {

                setSettingFieldName(true);
                setAddingField(false);
                setFieldEditMode(true);
                setFieldDisplayName(property.displayName);
                setFieldName(property.name);
                setFieldDescription(property.description);
                setFieldIsRequired(property.required ? 'true' : 'false');
                setFieldIsUnique(property.unique ? 'true' : 'false');
                if(property.type === BOOLEAN_FIElD_TYPE) {
                    setFieldDefaultValue(property.default === 'true' ? 'true' : 'false');
                }
                else {
                    setFieldDefaultValue(property.default || '');
                }

                if(property.type === MEDIA_FIELD_TYPE) {
                    setFieldAssetsType(property.assetsType || '');
                }

                if(property.type === SHORT_STRING_FIElD_TYPE || property.type === INTEGER_FIElD_TYPE) {
                    setFieldMax(property.max || '');
                    setFieldMin(property.min || '');
                    setFieldMinMaxCustomErrorMessage(property[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] || '');
                    setFieldOnlySpecifiedValues(property.onlyAllowedValues || '')
                }
                if(property.type === SHORT_STRING_FIElD_TYPE) {
                    setFieldMatchPattern(property.matchSpecificPattern || '');
                    setFieldMatchCustomPattern(property.matchSpecificPattern || '');
                    setFieldProhibitPattern(property.prohibitSpecificPattern || '');
                    setFieldMatchPatternCustomError(property[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN] || '');
                    setFieldProhibitPatternCustomError(property[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN] || '');
                }
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
                        : <RenderHeading className={'no-fields-added'} type={"primary"} title={'No fields added'} value={'No fields added'} />
                }
            </Grid>
        );
    }

    /*Close the form of fields properties*/
    function closeAddFieldForm() {
        setFieldName('');
        setFieldDescription('');
        setFieldDisplayName('');
        setFieldEditMode(false);
        setSettingFieldName(false);
        setFieldMatchPattern('');
        setFieldMax('');
        setFieldMin('');
        setFieldIsUnique('');
        setFieldIsRequired('');
        setFieldDefaultValue('');
        setFieldOnlySpecifiedValues('');
        setFieldProhibitPatternCustomError('');
        setFieldMatchPatternCustomError('');
        setFieldMinMaxCustomErrorMessage('');
        setFieldProhibitPattern('');
        setFieldMatchCustomPattern('');
        setFieldAssetsType('');
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
                        title={'Add Fields'}
                    />
                    {
                        properties && properties.length
                            ? <CommonButton
                                name={'Save Model'}
                                title={'Save Model'}
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
        <Grid className={'create-data-model-container'}>
            {
                isLoading ? <Loader /> :  null
            }
            <RenderHeading
                className={'main-heading'}
                type={"main"}
                value={`${fieldEditMode || contentModelId ? 'Edit' : 'Create'} Model`}
                title={`${fieldEditMode || contentModelId ? 'Edit' : 'Create'} Model`}
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
                                        title={'Please add name of the model'}
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
                                                title={'Add new field'}
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
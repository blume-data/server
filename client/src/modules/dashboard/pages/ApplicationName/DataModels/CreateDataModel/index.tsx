import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {AlertType, Form} from "../../../../../../components/common/Form";
import {CHECKBOX, ConfigField, DROPDOWN, TEXT} from "../../../../../../components/common/Form/interface";
import {
    BOOLEAN_FIElD_TYPE,
    CLIENT_USER_NAME,
    DATE_FIElD_TYPE,
    DECIMAL_FIELD_TYPE,
    DESCRIPTION,
    DISPLAY_NAME,
    ErrorMessagesType,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
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
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,

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
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {RootState} from "../../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {doPostRequest, doPutRequest} from "../../../../../../utils/baseApi";
import {getItemFromLocalStorage} from "../../../../../../utils/tools";
import {getBaseUrl} from "../../../../../../utils/urls";
import {AccordianCommon} from "../../../../../../components/common/AccordianCommon";
import BasicTableMIUI from "../../../../../../components/common/BasicTableMIUI";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {Alert} from "../../../../../../components/common/Toast";

export interface PropertiesType {
    type: string;
    name: string;
    displayName: string;
    description: string;
    required: boolean;
    unique: boolean;
    default: any;
    min: number;
    max: number;
    matchSpecificPattern: string;
    prohibitSpecificPattern: string;
    [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: string;
    [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]: string;
    [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type CreateDataModelType = PropsFromRedux & {
    onCreateDataModel: () => void;
    modelName?: string;
    modelId?: string;
    modelDescription?: string;
    modelDisplayName?: string;
    modelProperties?: PropertiesType[];
}

const CreateDataModel = (props: CreateDataModelType) => {

    const [settingFieldName, setSettingFieldName] = useState<boolean>(false);
    const [addingField, setAddingField] = useState<boolean>(false);


    const [fieldName, setFieldName] = useState<string>('');
    const [fieldDescription, setFieldDescription] = useState<string>('');
    const [fieldMax, setFieldMax] = useState<number | string>('');
    const [fieldMin, setFieldMin] = useState<number | string>('');
    const [fieldMatchPattern, setFieldMatchPattern] = useState<string>('');
    const [fieldProhibitPattern, setFieldProhibitPattern] = useState<string>('');
    const [fieldMinMaxCustomErrorMessage, setFieldMinMaxCustomErrorMessage] = useState<string>('');
    const [fielMatchPatternCustomErrorMessage, setFielMatchPatternCustomErrorMessage] = useState<string>('');
    const [fieldProhibitPatternCustomErrorMessage, setFieldProhibitPatternCustomErrorMessage] = useState<string>('');
    const [fieldDisplayName, setFieldDisplayName] = useState<string>('');
    const [fieldIsRequired, setFieldIsRequired] = useState<string>('');
    const [fieldIsUnique, setFieldIsUnique] = useState<string>('');
    const [fieldType, setFieldType] = useState<string>('');
    const [fieldEditMode, setFieldEditMode] = useState<boolean>(false);


    const [hideNames, setHideNames] = useState<boolean>(false);

    const [contentModelName, setContentModelName] = useState<string>('');
    const [contentModelDescription, setContentModelDescription] = useState<string>('');
    const [contentModelDisplayName, setContentModelDisplayName] = useState<string>('');
    const [contentModelId, setContentModelId] = useState<string | null>(null);

    const [properties, setProperties] = useState<PropertiesType[] | null>(null);

    const [response, setResponse] = useState<string | ErrorMessagesType[]>('');

    // to show alerts
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [alert, setAlertMessage] = React.useState<AlertType>({message: ''});

    const FIELD_NAME = 'fieldName';
    const MIN_VALUE = 1;
    const MAX_VALUE = 100;
    const FIELD_DESCRIPTION = 'fieldDescription';
    const FIELD_ID = 'fieldId';
    const FIELD_MATCH_SPECIFIC_PATTERN_STRING = 'matchSpecificPatternString';

    const FIELD_MATCH_SPECIFIC_PATTERN = 'matchSpecificPattern';
    const FIELD_PROHIBIT_SPECIFIC_PATTERN = 'prohibitSpecificPattern';

    const {env, CollectionUrl, applicationName, onCreateDataModel,
        modelProperties, modelId,
        modelName, modelDescription='', modelDisplayName,} = props;

    useEffect(() => {
        if(modelId && modelName && modelProperties && modelDisplayName) {
            setContentModelDescription(modelDescription);
            setContentModelDisplayName(modelDisplayName);
            setContentModelName(modelName);
            setProperties(modelProperties);
            setContentModelId(modelId);
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
            disabled: !!modelId,
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
            descriptionText: 'Name of the field'
            },
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
            },
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
                descriptionText: 'Description of field'
            },
            {
                required: false,
                placeholder: 'Is required',
                value: fieldIsRequired,
                className: 'is-required-check-box',
                name: IS_FIELD_REQUIRED,
                label: 'Is required',
                inputType: CHECKBOX,
                descriptionText: 'You won\'t be able to publish an entry if this field is empty'
            }
        ];

        if(fieldType === SHORT_STRING_FIElD_TYPE) {
            // select pattern
            hello.push({
                required: false,
                placeholder: 'Match a specific pattern',
                value: `${fieldMatchPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN,
                label: 'Match a specific pattern',
                options:[
                    {label: 'Email', value: "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$"},
                    {label: 'Url', value: "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+"},
                    {label: '12h Time', value: "^(0?[1-9]|1[012]):[0-5][0-9](:[0-5][0-9])?\\s*[aApP][mM]$"}
                ],
                inputType: DROPDOWN,
                descriptionText: 'Make this field match a pattern: e-mail address, URI, or a custom regular expression'
            });
            // allowed pattern
            hello.push({
                required: false,
                placeholder: 'Match a custom specific pattern',
                value: `${fieldMatchPattern}`,
                className: 'field-min-count',
                type: 'string',
                name: FIELD_MATCH_SPECIFIC_PATTERN_STRING,
                label: 'Match a custom specific pattern',
                inputType: TEXT,
                descriptionText: 'Make this field match a custom regular expression'
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
                descriptionText: 'Make this field invalid when a pattern is matched: custom regular expression (e.g. bad word list)'
            });
        }

        if(fieldType === SHORT_STRING_FIElD_TYPE || fieldType === INTEGER_FIElD_TYPE || fieldType === DECIMAL_FIELD_TYPE) {
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                value: `${fieldMax}`,
                className: 'field-max-count',
                type: 'number',
                name: FIELD_MAX,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Max character count' : 'Max value',
                inputType: TEXT,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a maximum allowed number of characters' : 'Specify a maximum allowed value'
            });
            hello.push({
                required: false,
                placeholder: fieldType ===SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                value: `${fieldMin}`,
                className: 'field-min-count',
                type: 'number',
                name: FIELD_MIN,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Min character count' : 'Min value',
                inputType: TEXT,
                descriptionText: fieldType === SHORT_STRING_FIElD_TYPE ? 'Specify a minimum allowed number of characters' : 'Specify a minimum allowed value'
            });
            hello.push({
                required: false,
                placeholder: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                value: `${fieldMinMaxCustomErrorMessage}`,
                className: 'field-custom-error-message',
                type: 'text',
                name: FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
                label: fieldType === SHORT_STRING_FIElD_TYPE ? 'Character count custom error message' : 'Allowed value custom error message',
                descriptionText: `Specify a custom error message if ${fieldType === SHORT_STRING_FIElD_TYPE ? 'characters are' : 'value is'} not within specified range`,
                inputType: TEXT
            });
        }

        hello.push({
            required: false,
            placeholder: 'Is unique',
            value: fieldIsUnique,
            className: 'is-unique-check-box',
            name: IS_FIELD_UNIQUE,
            label: 'Is unique',
            inputType: CHECKBOX,
            descriptionText: 'You won\'t be able to publish an entry if there is an existing entry with identical content\n'
        });

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

        setContentModelName(name ? name : trimCharactersAndNumbers(displayName));
        setContentModelDisplayName(displayName);
        setContentModelDescription(description);
        setHideNames(true);
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
            let propertyProhibitPattern = '';
            let propertyProhibitPatternError = '';
            let propertyMatchPatternString = '';
            values.forEach((value: any) => {
                const v = value.value;
                switch (value.name) {
                    case FIELD_PROHIBIT_SPECIFIC_PATTERN: {
                        propertyProhibitPattern = v;
                        break;
                    }
                    case FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN: {
                        propertyMatchPatternError = v;
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
                        propertyId = trimCharactersAndNumbers(v);
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
                }
            });

            setTimeout(() => {
                const property: PropertiesType = {
                    name: propertyId || trimCharactersAndNumbers(propertyName),
                    displayName: propertyName,
                    required: propertyIsRequired === 'true',
                    type: fieldType,
                    default: '',
                    matchSpecificPattern: propertyMatchPattern ? propertyMatchPattern : propertyMatchPatternString,
                    prohibitSpecificPattern: propertyProhibitPattern,
                    description: propertyDescription,
                    [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]: propertyProhibitPatternError,
                    [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]: propertyMatchPatternError,
                    [FIELD_MIN]: propertyMin,
                    [FIELD_MAX]: propertyMax,
                    [IS_FIELD_UNIQUE]: propertyIsUnique === 'true',
                    [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: propertyMinMaxCustomErrorMessage
                };

                const tempProperties = JSON.parse(JSON.stringify(properties ? properties : []));
                const exist = tempProperties.find((item: any) => item.name === property.name);

                if(exist) {
                    const newProperties: PropertiesType[] = tempProperties.map((propertyItem: PropertiesType) => {
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
    }

    function onClickAddFields() {
        setAddingField(true);
        setHideNames(true);
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
                // close the modal
                onCreateDataModel();
            }
            else if(response.errors && response.errors.length) {
                setIsAlertOpen(true);
                let message = '';
                response.errors.map((errorItem: ErrorMessagesType, index: number) => {
                    message+=`${index + 1}: ${errorItem[MESSAGE]} \n`
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
            <Grid className={'field-item'} title={description}>
                <Button onClick={onClick}>
                    {Icon}
                    <h2>{name}</h2>
                    <p>{description}</p>
                </Button>
            </Grid>
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

        const tableRows = [
            {name: 'Name', value: DISPLAY_NAME},
            {name: 'Description', value: DESCRIPTION},
            {name: 'Field Identifier', value: NAME},
            {name: 'Edit', value: 'edit', onClick: true},
        ];

        const items = [{
            [DISPLAY_NAME]: contentModelDisplayName,
            [DESCRIPTION]: contentModelDescription,
            [NAME]: contentModelName,
            edit: <IconButton><EditIcon /></IconButton>,
            'edit-click': () => onClick(),
        }];

        return (
            <Grid container justify={"space-between"} direction={"row"} className="name-section">
                {
                    items && items.length ? <BasicTableMIUI
                        rows={items}
                        tableRows={tableRows}
                        tableName={'Model Name'}
                    /> : null
                }
            </Grid>
        )
    }

    function renderPropertiesSection() {

        const tableRows = [
            {name: 'Name', value: DISPLAY_NAME},
            {name: 'Description', value: DESCRIPTION},
            {name: 'Type', value: 'type'},
            {name: 'Edit', value: 'edit', onClick: true},
            {name: 'Delete', value: 'delete', onClick: true}
        ];

        function onClickEdit(property: PropertiesType) {
            setSettingFieldName(true);
            setAddingField(false);
            setFieldType(property.type);
            setFieldEditMode(true);
            setFieldDisplayName(property.displayName);
            setFieldName(property.name);
            setFieldDescription(property.description);
            setFieldIsRequired(property.required ? 'true' : 'false');
            setFieldMax(property.max || '');
            setFieldMin(property.min || '');
            setFieldIsUnique(property.unique ? 'true' : 'false');
            if(fieldType === SHORT_STRING_FIElD_TYPE) {
                setFieldMatchPattern(property.matchSpecificPattern || '');
                setFieldProhibitPattern(property.prohibitSpecificPattern || '');
            }
            setFieldMinMaxCustomErrorMessage(property[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] || '');
        }

        const rows = properties && properties.map(property => {
            return {
                ...property,
                edit: <IconButton><EditIcon /></IconButton>,
                delete: <IconButton><DeleteIcon /></IconButton>,
                'delete-click': () => console.log('delete is clicked'),
                'edit-click': () => onClickEdit(property),
            }
        })

        return (
            <Grid container direction={"column"} className={'property-section-container'}>
                {
                    properties && properties.length ? <BasicTableMIUI
                        rows={rows}
                        tableRows={tableRows}
                        tableName={'Fields'}
                    /> : <p>No fields added</p>
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
        setFieldIsRequired('');
        setSettingFieldName(false);
    }

    function renderAddFieldsAndSaveModelButtonGroup() {
        if(contentModelDisplayName) {
            return (
                <ButtonGroup className={'modal-action-buttons'}>
                    <Button
                        onClick={onClickAddFields}
                        color={"secondary"}
                        variant={"contained"}>
                        Add Fields
                    </Button>
                    {
                        properties && properties
                            ? <Button
                                onClick={onClickSaveDataModel}
                                color={"primary"}
                                variant={"contained"}>
                                Save Model
                            </Button>
                            : null
                    }
                </ButtonGroup>
            );
        }
        return null;

    }

    return (
        <Grid>
            <Grid className="create-content-model">

                <AccordianCommon shouldExpand={true} name={'Model name'}>
                    {
                        hideNames
                            ? renderNameSection()
                            : <Form
                                response={response}
                                submitButtonName={'Save model name'}
                                className={'create-content-model-form'}
                                fields={nameFields}
                                onSubmit={onSubmitCreateContentModel}
                            />

                    }
                </AccordianCommon>

                {
                    contentModelDisplayName
                        ? <AccordianCommon name={'Model fields'}>
                            {renderPropertiesSection()}
                          </AccordianCommon>
                        : null
                }

                {
                    addingField
                    ? <Grid container  className="fields-container">
                        <Grid container justify={"flex-end"}>
                            <Button onClick={onClickCancelAddField}>Cancel</Button>
                        </Grid>
                        <Grid container justify={"center"} className="fields-grid">
                            {fieldItem('Formatted Text', 'customised text with links and media', <TextFieldsIcon />, LONG_STRING_FIELD_TYPE)}
                            {fieldItem('Text','names, paragraphs, title', <TextFieldsIcon />, SHORT_STRING_FIElD_TYPE)}
                            {fieldItem('Number', 'numbers like age, count, quantity', <Grid className={'numbers'}>
                                <Looks3Icon />
                                <Looks4Icon />
                                <Looks5Icon />
                            </Grid>, INTEGER_FIElD_TYPE )}
                            {fieldItem('Decimal', 'decimals like quantity, currency', <Grid className={'numbers'}>
                                <Looks3Icon />
                                <Looks4Icon />
                                <Looks5Icon />
                            </Grid>, DECIMAL_FIELD_TYPE )}
                            {fieldItem('Date and time', 'time, date, days, events', <DateRangeIcon />, DATE_FIElD_TYPE)}
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

            </Grid>
            <Alert
                isAlertOpen={isAlertOpen}
                onAlertClose={setIsAlertOpen}
                severity={alert.severity}
                message={alert.message} />
        </Grid>
    );
}

const mapState = (state: RootState) => {
    return {
        env: state.authentication.env,
        applicationName: state.authentication.applicationName,
        CollectionUrl: state.routeAddress.routes.data?.CollectionUrl
    }
};

const connector = connect(mapState);
export default connector(CreateDataModel);
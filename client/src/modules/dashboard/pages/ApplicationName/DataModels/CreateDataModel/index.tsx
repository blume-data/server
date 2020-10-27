import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../../components/common/Form";
import {CHECKBOX, ConfigField, TEXT} from "../../../../../../components/common/Form/interface";
import {
    BOOLEAN_FIElD_TYPE, CLIENT_USER_NAME, DATE_FIElD_TYPE, DECIMAL_FIELD_TYPE,
    ErrorMessagesType, INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE, trimCharactersAndNumbers
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
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {RootState} from "../../../../../../rootReducer";
import {connect, ConnectedProps} from "react-redux";
import {doPostRequest, doPutRequest} from "../../../../../../utils/baseApi";
import {getItemFromLocalStorage} from "../../../../../../utils/tools";
import {getBaseUrl} from "../../../../../../utils/urls";
import {AccordianCommon} from "../../../../../../components/common/AccordianCommon";

export interface PropertiesType {
    displayName: string;
    name: string;
    type: string;
    required: boolean;
    description: string;
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
    const [fieldType, setFieldType] = useState<string>('');
    const [hideNames, setHideNames] = useState<boolean>(false);

    const [contentModelName, setContentModelName] = useState<string>('');
    const [contentModelDescription, setContentModelDescription] = useState<string>('');
    const [contentModelDisplayName, setContentModelDisplayName] = useState<string>('');
    const [contentModelId, setContentModelId] = useState<string | null>(null);

    const [properties, setProperties] = useState<PropertiesType[] | null>(null);

    const DISPLAY_NAME = 'displayName';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const FIELD_NAME = 'fieldName';
    const FIELD_TYPE = 'fieldType';
    const FIELD_DESCRIPTION = 'fieldDescription';
    const FIELD_ID = 'fieldId';
    const IS_FIELD_REQUIRED = 'required';

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
            label: 'Display Name',
            inputType: TEXT,
        },
        {
            required: false,
            placeholder: 'Name Identifier',
            value: contentModelName,
            className: 'create-content-model-name-identifier',
            type: 'text',
            name: NAME,
            label: 'Name Identifier',
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
        },
    ];

    const propertyNameFields = () => {

        const hello: ConfigField[] = [
            {
            required: true,
            placeholder: 'Field Name',
            value: '',
            className: 'create-content-model-name-text-field',
            type: 'text',
            name: FIELD_NAME,
            label: 'Field Name',
            inputType: TEXT,
            },
            {
                required: false,
                placeholder: 'Field Id',
                value: '',
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_ID,
                label: 'Field id',
                inputType: TEXT,
            },
            {
                required: false,
                placeholder: 'Field description',
                value: '',
                className: 'create-content-model-name-text-field',
                type: 'text',
                name: FIELD_DESCRIPTION,
                label: 'Field description',
                inputType: TEXT,
            },
            {
                required: false,
                placeholder: 'Is required',
                value: '',
                className: 'is-required-radio',
                name: IS_FIELD_REQUIRED,
                label: 'Is required',
                inputType: CHECKBOX,
            },
        ];

        return hello;
    };

    function onSubmitCreateContentModel(values: object[]): Promise<string | ErrorMessagesType[]> {

        return new Promise(async (resolve, reject) => {

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
            setAddingField(true);
            return resolve('')
        })
    }

    function onSubmitFieldProperty(values: any): Promise<string | ErrorMessagesType[]> {

        return new Promise(async (resolve, reject) => {

            setSettingFieldName(false);

            if(values && values.length) {

                let propertyId = '';
                let propertyName = '';
                let propertyIsRequired = '';
                let propertyDescription = '';
                values.forEach((value: any) => {
                    switch (value.name) {
                        case FIELD_ID: {
                            propertyId = trimCharactersAndNumbers(value.value);
                            break;
                        }
                        case FIELD_NAME: {
                            propertyName = value.value;
                            break;
                        }
                        case IS_FIELD_REQUIRED: {
                            propertyIsRequired = value.value;
                            break;
                        }

                        case FIELD_DESCRIPTION: {
                            propertyDescription = value.value;
                        }

                    }
                });

                setTimeout(() => {
                    const property: PropertiesType = {
                        name: propertyId || trimCharactersAndNumbers(propertyName),
                        displayName: propertyName,
                        required: propertyIsRequired === 'true',
                        type: fieldType,
                        description: propertyDescription
                    };
                    const tempProperties = JSON.parse(JSON.stringify(properties ? properties : []));
                    tempProperties.push(property);
                    setProperties(tempProperties);
                });
            }

            return resolve('')
        })
    }

    function onClickAddFields() {
        setAddingField(true);
        setHideNames(true);
    }

    async function onClickSaveDataModel() {

        const clientUserName = getItemFromLocalStorage(CLIENT_USER_NAME);
        if(CollectionUrl && clientUserName) {
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
            }
            else {
                response = await doPostRequest(`${getBaseUrl()}${url}`, {
                    name: contentModelName,
                    displayName: contentModelDisplayName,
                    description: contentModelDescription,
                    rules: properties
                }, true);
            }

            if(response && !response.errors) {
                // close the modal
                onCreateDataModel();
            }
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

        return (
            <Grid container justify={"space-between"} direction={"row"} className="name-section">
                <Grid className="name-section-grid-item">
                    <Grid item className={'name-section-item'}>
                        <p>Name:</p>
                        <h2>{contentModelDisplayName}</h2>
                    </Grid>
                    <Grid item className={'name-section-item'}>
                        <p>Description: </p>
                        <h2>{contentModelDescription}</h2>
                    </Grid>
                </Grid>
                <Grid className="name-section-grid-item">
                    <Grid item className={'name-section-item edit-button'}>
                        <Button title={'edit content model'} onClick={onClick}>
                            <EditIcon /> Edit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    function renderPropertiesSection() {
        return (
            <Grid container direction={"column"} className={'property-section-container'}>
                {properties && properties.map(property => {
                    return (
                        <Grid container justify={"flex-start"} className={'property-item'}>
                            <h2 className={'property-name'}>{property.name}</h2>
                            <h2 className="property-type">({property.type})</h2>
                            <h2 className={'property-description'}>{property.description}</h2>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    return (
        <Grid>
            <Grid className="create-content-model">

                <AccordianCommon name={'Model name'}>
                    {
                        hideNames
                            ? renderNameSection()
                            : <Form
                                submitButtonName={'Save model name'}
                                className={'create-content-model-form'}
                                fields={nameFields}
                                onSubmit={onSubmitCreateContentModel}
                            />

                    }
                </AccordianCommon>

                <AccordianCommon name={'Model fields'}>
                    {
                        properties
                            ? renderPropertiesSection()
                            : null
                    }
                </AccordianCommon>

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
                    : <ButtonGroup className={'modal-action-buttons'}>
                            <Button
                                onClick={onClickAddFields}
                                color={"secondary"}
                                variant={"contained"}>
                                Add Fields
                            </Button>
                            {
                                properties && properties.length
                                ? <Button
                                        onClick={onClickSaveDataModel}
                                        color={"primary"}
                                        variant={"contained"}>
                                        Save Model
                                    </Button>
                                : null
                            }
                        </ButtonGroup>
                }

                {
                    settingFieldName
                    ? <Grid container className={'set-fields-property-container'}>
                        <Form
                            submitButtonName={'Add field'}
                            onSubmit={onSubmitFieldProperty}
                            fields={propertyNameFields()}
                            className={'field-property-form'}
                        />
                      </Grid>
                    : null
                }

            </Grid>
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
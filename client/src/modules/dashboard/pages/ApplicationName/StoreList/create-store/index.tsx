import React, {Fragment, useState} from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../../components/common/Form";
import {ConfigField, TEXT} from "../../../../../../components/common/Form/interface";
import {
    APPLICATION_NAME, BOOLEAN_FIElD_TYPE, DATE_FIElD_TYPE, DECIMAL_FIELD_TYPE,
    ErrorMessagesType, INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
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

export const CreateStore = () => {

    const [settingFieldName, setSettingFieldName] = useState<boolean>(false);
    const [addingField, setAddingField] = useState<boolean>(false);
    const [fieldName, setFieldName] = useState<string>('');
    const [isRequired, setRequired] = useState<boolean>(false);
    const [fieldType, setFieldType] = useState<string>('');
    const [hideNames, setHideNames] = useState<boolean>(false);

    const [contentModelName, setContentModelName] = useState<string>('');
    const [contentModelDescription, setContentModelDescription] = useState<string>('');
    const [contentModelDisplayName, setContentModelDisplayName] = useState<string>('');

    const DISPLAY_NAME = 'displayName';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const FIELD_NAME = 'fieldName';
    const FIELD_TYPE = 'fieldType';
    const FIELD_ID = 'fieldId';

    const nameFields: ConfigField[] = [
        {
            required: true,
            placeholder: 'Display Name',
            value: contentModelDisplayName,
            className: 'create-content-model-name-text-field',
            type: 'text',
            name: DISPLAY_NAME,
            label: 'Display Name',
            inputType: TEXT,
        },
        {
            required: false,
            placeholder: 'Name',
            value: contentModelName,
            className: 'create-content-model-display-name-text-field',
            type: 'text',
            name: NAME,
            label: 'Name',
            inputType: TEXT,
        },
        {
            required: false,
            placeholder: 'Description',
            value: contentModelDescription,
            className: 'create-content-model-description-text-field',
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
            }
        ];

        return hello;
    };

    function onSubmitCreateContentModel(values: object[]): Promise<string | ErrorMessagesType[]> {

        console.log('value', values);

        return new Promise(async (resolve, reject) => {

            values.forEach((value: any) => {
                if(value.name === NAME) {
                    setContentModelName(value.value);
                }
                else if(value.name === DISPLAY_NAME) {
                    setContentModelDisplayName(value.value);
                }
                else if(value.name === DESCRIPTION) {
                    setContentModelDescription(value.value);
                }
            });
            setHideNames(true);
            setAddingField(true);
            return resolve('')
        })
    }

    function onSubmitFieldProperty(values: object[]): Promise<string | ErrorMessagesType[]> {

        console.log('value', values);

        return new Promise(async (resolve, reject) => {

            setSettingFieldName(false);

            return resolve('')
        })
    }

    function onClickAddFields() {
        setAddingField(true);
        setHideNames(true);
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

    // Data Model name, description, display name
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
            <Paper>
                <Grid container justify={"flex-start"} direction={"row"} className="name-section">
                    <Grid item className={'name-section-item'}>
                        <p>Name: </p>
                        <h2>{contentModelName}</h2>
                    </Grid>
                    <Grid item className={'name-section-item'}>
                        <p>Description: </p>
                        <h2>{contentModelDescription}</h2>
                    </Grid>
                    <Grid item className={'name-section-item'}>
                        <p>Display name:</p>
                        <h2>{contentModelDisplayName}</h2>
                    </Grid>
                    <Grid item className={'name-section-item edit-button'}>
                        <Button title={'edit content model'} onClick={onClick}>
                            <EditIcon /> Edit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

    return (
        <Grid>
            <Grid className="create-content-model">

                {
                    hideNames
                        ? renderNameSection()
                        : <Form
                            submitButtonName={'Create data model'}
                            className={'create-content-model-form'}
                            fields={nameFields}
                            onSubmit={onSubmitCreateContentModel}
                          />

                }

                {
                    addingField
                    ? <Grid container justify={"center"} className="fields-container">
                            {fieldItem(
                                'Formatted Text',
                                'customised text with links and media',
                                <TextFieldsIcon />,
                                LONG_STRING_FIELD_TYPE
                                )}
                            {fieldItem(
                                'Text',
                                'names, paragraphs, title',
                                <TextFieldsIcon />,
                                SHORT_STRING_FIElD_TYPE
                                )}
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
                    : settingFieldName
                    ? null
                    : <Button
                        onClick={onClickAddFields}
                        color={"primary"}
                        variant={"contained"}>
                        Add Fields
                      </Button>
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
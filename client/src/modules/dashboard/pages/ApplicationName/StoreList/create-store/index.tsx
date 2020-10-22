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

export const CreateStore = () => {

    const [addingField, setAddingField] = useState<boolean>(false);
    const [fieldName, setFieldName] = useState<string>('');
    const [isRequired, setRequired] = useState<boolean>(false);
    const [fieldType, setFieldType] = useState<string>('');

    const fields: ConfigField[] = [
        {
            required: true,
            placeholder: 'Display Name',
            value: '',
            className: 'create-content-model-name-text-field',
            type: 'text',
            name: 'displayName',
            label: 'Display Name',
            inputType: TEXT,
        },
        {
            required: true,
            placeholder: 'Name',
            value: '',
            className: 'create-content-model-display-name-text-field',
            type: 'text',
            name: 'name',
            label: 'Name',
            inputType: TEXT,
        },
        {
            required: true,
            placeholder: 'Description',
            value: '',
            className: 'create-content-model-description-text-field',
            type: 'text',
            name: 'description',
            label: 'Description',
            inputType: TEXT,
        },
    ];

    function onCreateContentModel(values: object[]): Promise<string | ErrorMessagesType[]> {

        console.log('value', values);

        return new Promise(async (resolve, reject) => {
            return resolve('')
        })
    }

    function fieldItem(name: string, description: string, Icon: JSX.Element, value: string) {
        return (
            <Grid className={'field-item'} title={description}>
                <Button onClick={() => setFieldType(value)}>
                    {Icon}
                    <h2>{name}</h2>
                    <p>{description}</p>
                </Button>
            </Grid>
        );
    }



    return (
        <Grid>
            <Grid className="create-content-model">

                <Form className={'create-content-model-form'} fields={fields} onSubmit={onCreateContentModel} />

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
                    : <Button
                        onClick={() => setAddingField(true)}
                            color={"primary"}
                            variant={"contained"}>
                        Add Fields
                      </Button>
                }

            </Grid>
        </Grid>
    );
}
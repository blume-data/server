import React, {Fragment} from "react";
import {Grid} from "@material-ui/core";
import {Form} from "../../../../../../components/common/Form";
import {ConfigField, TEXT} from "../../../../../../components/common/Form/interface";
import {APPLICATION_NAME, ErrorMessagesType} from "@ranjodhbirkaur/constants";
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

    function fieldItem(name: string, description: string, Icon: JSX.Element) {
        return (
            <Grid className={'field-item'}>
                <Button>
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

                <Grid container justify={"center"} className="fields-container">
                    {fieldItem('Formatted Text', 'customised text with links and media', <TextFieldsIcon />)}
                    {fieldItem('Text', 'names, paragraphs, title', <TextFieldsIcon />)}
                    {fieldItem('Number', 'numbers like age, count, quantity', <Grid className={'numbers'}>
                        <Looks3Icon />
                        <Looks4Icon />
                        <Looks5Icon />
                    </Grid> )}
                    {fieldItem('Date and time', 'time, date, days, events', <DateRangeIcon />)}
                    {fieldItem('Location', 'coordinates', <LocationOnIcon />)}
                    {fieldItem('Boolean', 'true or false', <ToggleOffIcon />)}
                    {fieldItem('Json', 'json data', <CodeIcon />)}
                    {fieldItem('Media', 'videos, photos, files', <PermMediaIcon />)}
                    {fieldItem('Reference', 'For example a comment can refer to authors', <LinkIcon />)}
                </Grid>

            </Grid>
        </Grid>
    );
}
import React, {ChangeEvent} from "react";
import {Grid} from "@material-ui/core";
import { TextBox } from "./TextBox";
import {DropDown} from "./DropDown";
import {ConfigField, FormType} from "./interface";

const DROPDOWN = 'dropdown';
const BIG_TEXT = 'bigText';
const TEXT = 'text';


export const Form = (props: FormType) => {

    const {className} = props;

    const config: {fields: ConfigField[]} = {
        fields: [
            {
                inputType: DROPDOWN,
                placeholder: 'any',
                name: 'some name',
                required: true,
                value: 'sdf',
                className: 'dsf',
                onChange: (event: ChangeEvent<any>) => {},
                options: [{label: 'df', value: 'dsfdsf'}]
            },
            {
                inputType: BIG_TEXT,
                placeholder: 'big text',
                name: 'some name big text',
                required: false,
                value: 'sdf',
                className: 'dsf',
                onChange: (event: ChangeEvent<any>) => {},
            },
            {
                inputType: TEXT,
                placeholder: 'small text',
                name: 'some name small text',
                required: true,
                value: 'sdf',
                className: 'dsf',
                onChange: (event: ChangeEvent<any>) => {},
            },
        ]
    };

    function renderFields(field: ConfigField, index: number) {
        const {inputType, options, id, className, name, onChange, placeholder, required, value} = field;
        if (inputType === TEXT) {
            return (
                <TextBox
                    key={index}
                    required={required}
                    placeholder={placeholder}
                    onChange={onChange}
                    label={name}
                    id={id}
                    value={value}
                    className={'sddsfdsf'} />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    value={value} options={options && options.length ? options : []}
                    onChange={onChange} placeholder={placeholder} required={required} index={index} name={name}
                    key={index} className={className} />
            );
        }
        if(inputType === BIG_TEXT) {
            return (
                <TextBox
                    key={index}
                    multiline={true}
                    required={required}
                    placeholder={placeholder}
                    onChange={onChange}
                    label={name}
                    id={id}
                    value={value}
                    className={'text-asdfrea-form-control'}  />
            );
        }
    }

    return (
        <Grid className={className} container justify={'center'} direction={'column'}>
            {config.fields.map((option: ConfigField, index) => {
                return renderFields(option, index);
            })}
        </Grid>
    );
};
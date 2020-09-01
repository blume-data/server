import React, {ChangeEvent, useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import { TextBox } from "./TextBox";
import {DropDown} from "./DropDown";
import {ConfigField, FormType, TEXT, BIG_TEXT, DROPDOWN} from "./interface";

interface FormState {
    name: string;
    value: string;
    isTouched: boolean;
    errorMessage: string;
}

const SET_VALUE_ACTION = 'SET_VALUE_ACTION';
const SET_ERROR_MESSAGE_ACTION = 'SET_ERROR_MESSAGE_ACTION';
const SET_IS_TOUCHED_ACTION = 'SET_IS_TOUCHED_ACTION';

export const Form = (props: FormType) => {

    const [formState, setFormState] = useState<FormState[]>([]);
    const {className, fields} = props;

    function changeValue(event: ChangeEvent<any>, field: string, action: string, actionValue?: string) {
        const value = event.target.value;
        let state: FormState[];
        if (action === SET_VALUE_ACTION) {
            state = formState.map((item) => {
                if (item.name === field) {
                    return {
                        ...item,
                        value,
                        errorMessage: (!value) ? `${item.name} is required` : '',
                    }
                }
                return item;
            });
            setFormState(state);
        }
        if (action === SET_ERROR_MESSAGE_ACTION) {
            state = formState.map((item) => {
                if (item.name === field) {
                    return {
                        ...item,
                        errorMessage: `${actionValue}`
                    }
                }
                return item;
            });
            setFormState(state);
        }
        if (action === SET_IS_TOUCHED_ACTION) {
            state = formState.map((item) => {
                if (item.name === field) {
                    return {
                        ...item,
                        isTouched: true
                    }
                }
                return item;
            });
            setFormState(state);
        }
    }

    useEffect(() => {
        const state = fields.map(field => {
            return {
                name: field.name,
                [`value`]: field.value,
                [`isTouched`]: false,
                [`errorMessage`]: ''
            };
        });
        setFormState(state);
    }, []);

    function getValue(name: string) {
        const value = formState.find(item => item.name === name);
        if (value) {
            return value.value;
        }
        return '';
    }

    function hasError(name: string) {
        const value = formState.find(item => item.name === name);
        if (value) {
            return (!value.value && value.isTouched)
        }
        return false;
    }

    function renderFields(field: ConfigField, index: number) {
        const {inputType, options, id, className, name, placeholder, required} = field;
        if (inputType === TEXT) {
            return (
                <TextBox
                    key={index}
                    error={hasError(name)}
                    required={required}
                    placeholder={placeholder}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    onBlur={(e) => changeValue(e, name, SET_IS_TOUCHED_ACTION)}
                    label={name}
                    id={id}
                    value={getValue(name)}
                    className={'sddsfdsf'} />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    value={getValue(name)} options={options && options.length ? options : []}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    placeholder={placeholder} required={required} index={index} name={name}
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
                    onBlur={(e) => changeValue(e, name, SET_IS_TOUCHED_ACTION)}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    label={name}
                    id={id}
                    value={getValue(name)}
                    className={'text-asdfrea-form-control'}  />
            );
        }
    }

    console.log('value', formState);

    return (
        <Grid className={`${className} app-form`} container justify={'center'} direction={'column'}>
            {fields.map((option: ConfigField, index) => {
                return renderFields(option, index);
            })}
        </Grid>
    );
};
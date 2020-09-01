import React, {ChangeEvent, useEffect, useState} from "react";
import {Grid, Button} from "@material-ui/core";
import { TextBox } from "./TextBox";
import {DropDown} from "./DropDown";
import {ConfigField, FormType, TEXT, BIG_TEXT, DROPDOWN} from "./interface";
import './style.scss';

interface FormState {
    name: string;
    value: string;
    isTouched: boolean;
    helperText: string;
}

const SET_VALUE_ACTION = 'SET_VALUE_ACTION';
const SET_ERROR_MESSAGE_ACTION = 'SET_ERROR_MESSAGE_ACTION';
const SET_IS_TOUCHED_ACTION = 'SET_IS_TOUCHED_ACTION';

export const Form = (props: FormType) => {

    const [formState, setFormState] = useState<FormState[]>([]);
    const {className, fields, onSubmit} = props;

    function setErrorMessage(name: string) {
        return `${name} is required`;
    }

    function changeValue(event: ChangeEvent<any>, field: string, action: string, actionValue?: string) {
        const value = event.target.value;
        let state: FormState[];
        if (action === SET_VALUE_ACTION) {
            state = formState.map((item) => {
                if (item.name === field) {
                    return {
                        ...item,
                        value,
                        helperText: (!value) ? setErrorMessage(field) : '',
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
                        helperText: `${actionValue}`
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
                        helperText: !item.value ? setErrorMessage(item.name) : '',
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
                [`isTouched`]: !!field.helperText,
                [`helperText`]: field.helperText || ''
            };
        });
        setFormState(state);
    }, [fields]);

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

    function getHelperText(name: string) {
        const value = formState.find(item => item.name === name);
        if (value) {
            return value.helperText
        }
        return '';
    }

    function renderFields(field: ConfigField, index: number) {
        const {inputType, options, id, className, name, placeholder, required, type='text', label} = field;
        if (inputType === TEXT) {
            return (
                <TextBox
                    type={type}
                    key={index}
                    name={name}
                    error={hasError(name)}
                    required={required}
                    placeholder={placeholder}
                    helperText={getHelperText(name)}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    onBlur={(e) => changeValue(e, name, SET_IS_TOUCHED_ACTION)}
                    label={label}
                    id={id}
                    value={getValue(name)}
                    className={'sddsfdsf'} />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    onBlur={(e) => changeValue(e, name, SET_IS_TOUCHED_ACTION)}
                    value={getValue(name)} options={options && options.length ? options : []}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    placeholder={placeholder} required={required} index={index} name={name}
                    label={label} error={hasError(name)} helperText={getHelperText(name)}
                    key={index} className={className} />
            );
        }
        if(inputType === BIG_TEXT) {
            return (
                <TextBox
                    type={type}
                    key={index}
                    name={name}
                    multiline={true}
                    required={required}
                    placeholder={placeholder}
                    helperText={getHelperText(name)}
                    onBlur={(e) => changeValue(e, name, SET_IS_TOUCHED_ACTION)}
                    onChange={(e) => changeValue(e, name, SET_VALUE_ACTION)}
                    label={label}
                    id={id}
                    value={getValue(name)}
                    className={'text-asdfrea-form-control'}  />
            );
        }
    }

    function onClickSubmit() {
        let isValid = true;
        formState.forEach(item => {
            const formItem = fields.find(field => field.name === item.name);
            if (formItem && formItem.required && !item.value) {
                isValid = false
            }
        });

        if(isValid) {
            const values: {name: string; value: string}[] = [];
            formState.forEach(item => {
                values.push({
                    name: item.name,
                    value: item.value
                });
            });
            onSubmit(values);
            clearForm();
        }
        else {
            let newFormState: FormState[] = [];
            formState.forEach(item => {
                const formItem = fields.find(field => field.name === item.name);
                if (formItem && formItem.required && !item.value) {
                    newFormState.push({
                        ...item,
                        isTouched: true,
                        helperText: getHelperText(item.name)
                    })
                }
                else {
                    newFormState.push(item);
                }
            });
            setFormState(newFormState);
        }
    }

    function clearForm() {
        const values: FormState[] = [];
        formState.forEach(item => {
            values.push({
                ...item,
                value: '',
                helperText: '',
                isTouched: false
            });
        });
        setFormState(values);
    }

    return (
        <Grid className={`${className} app-form`} container justify={'center'} direction={'column'}>
            {fields.map((option: ConfigField, index) => {
                return renderFields(option, index);
            })}

            <Grid container justify={'space-between'}>
                <Grid item>
                    <Button variant="outlined" onClick={clearForm} color={'secondary'}>Clear</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={onClickSubmit} color={'primary'}>Submit</Button>
                </Grid>
            </Grid>
        </Grid>
    );
};
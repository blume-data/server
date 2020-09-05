import React, {ChangeEvent, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {TextBox} from "./TextBox";
import {DropDown} from "./DropDown";
import {BIG_TEXT, ConfigField, DROPDOWN, FormType, TEXT} from "./interface";
import './style.scss';
import {ErrorMessagesType, FIELD, MESSAGE} from "@ranjodhbirkaur/constants";

interface FormState {
    name: string;
    value: string;
    isTouched: boolean;
    helperText: string;
}

const SET_VALUE_ACTION = 'SET_VALUE_ACTION';
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
            return !!(value.helperText)
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

    async function onClickSubmit() {
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
            const res = await onSubmit(values);
            if (typeof res === 'string') {
                clearForm();
            }
            else if(res && res.length) {
                setFormErrors(res);
            }
        }
        else {
            let newFormState: FormState[] = [];
            formState.forEach(item => {
                const formItem = fields.find(field => field.name === item.name);
                if (formItem && formItem.required && !item.value) {
                    newFormState.push({
                        ...item,
                        isTouched: true,
                        helperText: setErrorMessage(item.name)
                    });
                }
                else {
                    newFormState.push(item);
                }
            });
            setFormState(newFormState);
        }
    }

    function setFormErrors(errors?: ErrorMessagesType[]) {
        const values: FormState[] = [];
        formState.forEach(item => {
            if (errors && errors.length) {
                const error = errors.find(errorItem => errorItem[FIELD] === item.name);
                if (error) {
                    values.push({
                        ...item,
                        helperText: error[MESSAGE],
                        isTouched: true
                    });
                }
                else {
                    values.push({
                        ...item
                    });
                }
            }
        });
        setFormState(values);
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
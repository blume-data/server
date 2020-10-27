import React, {ChangeEvent, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {TextBox} from "./TextBox";
import {DropDown} from "./DropDown";
import {BIG_TEXT, CHECKBOX, ConfigField, DROPDOWN, FormType, RADIO, TEXT} from "./interface";
import './style.scss';
import {ErrorMessagesType, FIELD, MESSAGE} from "@ranjodhbirkaur/constants";
import {Alert} from "../Toast";
import {PLEASE_PROVIDE_VALID_VALUES} from "../../../modules/authentication/pages/Auth/constants";
import {CommonRadioField} from "./CommonRadioField";
import {CommonCheckBoxField} from "./CommonCheckBoxField";

interface FormState {
    label: string;
    value: string;
    isTouched: boolean;
    helperText: string;
}

const SET_VALUE_ACTION = 'SET_VALUE_ACTION';
const SET_IS_TOUCHED_ACTION = 'SET_IS_TOUCHED_ACTION';

export interface AlertType {
    message: string;
    severity?: 'success' | 'error' | 'info'
}

export const Form = (props: FormType) => {

    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [alert, setAlertMessage] = React.useState<AlertType>({message: ''});

    const [formState, setFormState] = useState<FormState[]>([]);
    const {className, fields, onSubmit, submitButtonName, response='', clearOnSubmit=false} = props;

    function setErrorMessage(name: string) {
        return `${name} is required`;
    }

    function changeValue(event: ChangeEvent<any>, field: string, action: string) {
        const value = event.target.value;
        let state: FormState[];

        const fieldItem = fields.find(ranjodh => ranjodh.label === field);
        if(fieldItem) {
            if (action === SET_VALUE_ACTION) {
                state = formState.map((item) => {
                    if (item.label === field) {
                        return {
                            ...item,
                            value,
                            helperText: (!value && fieldItem.required) ? setErrorMessage(item.label) : '',
                        }
                    }
                    return item;
                });
                setFormState(state);
            }
            if (action === SET_IS_TOUCHED_ACTION) {
                state = formState.map((item) => {
                    if (item.label === field) {
                        return {
                            ...item,
                            helperText: (!item.value && fieldItem.required) ? setErrorMessage(item.label) : '',
                            isTouched: true
                        }
                    }
                    return item;
                });
                setFormState(state);
            }
        }
    }

    useEffect(() => {
        const state = fields.map(field => {
            return {
                label: field.label,
                [`value`]: field.value,
                [`isTouched`]: !!field.helperText,
                [`helperText`]: field.helperText || ''
            };
        });
        setFormState(state);
    }, [fields]);

    useEffect(() => {

        if (typeof response === 'string') {
            if(clearOnSubmit) {
                clearForm();
            }
        }
        else if(response && response.length) {
            setFormErrors(response);
            if (response.length === 1 && !response[0][FIELD] && response[0][MESSAGE]) {
                showAlert({message: response[0][MESSAGE], severity: "error"});
            }
            else {
                showAlert({message: PLEASE_PROVIDE_VALID_VALUES, severity: "error"});
            }
    }
    }, [response, clearOnSubmit])

    function getValue(label: string) {
        const value = formState.find(item => item.label === label);
        if (value) {
            return value.value;
        }
        return '';
    }

    function hasError(label: string) {
        const value = formState.find(item => item.label === label);
        if (value) {
            return !!(value.helperText)
        }
        return false;
    }

    function getHelperText(label: string) {
        const value = formState.find(item => item.label === label);
        if (value) {
            return value.helperText
        }
        return '';
    }

    function showAlert(alertParam: AlertType) {
        setIsAlertOpen(true);
        setAlertMessage({
            message: alertParam.message,
            severity: alertParam.severity
        });
    }

    function renderFields(field: ConfigField, index: number) {
        const {inputType, options, id, className, name, placeholder, required, type='text', label, disabled=false} = field;

        function onChange(e: ChangeEvent<any>) {
            changeValue(e, label, SET_VALUE_ACTION)
        }

        function onBlur(e: ChangeEvent<any>) {
            changeValue(e, label, SET_IS_TOUCHED_ACTION)
        }

        const helperText = getHelperText(label);
        const value = getValue(label);
        const error = hasError(label);


        if (inputType === TEXT) {
            return (
                <TextBox
                    type={type}
                    key={index}
                    name={name}
                    disabled={disabled}
                    error={error}
                    required={required}
                    placeholder={placeholder}
                    helperText={helperText}
                    onChange={onChange}
                    onBlur={onBlur}
                    label={label}
                    id={id}
                    value={value}
                    className={className} />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    disabled={disabled}
                    onBlur={onBlur}
                    value={value}
                    options={options && options.length ? options : []}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    index={index}
                    name={name}
                    label={label}
                    error={error}
                    helperText={helperText}
                    key={index}
                    className={className} />
            );
        }
        if(inputType === BIG_TEXT) {
            return (
                <TextBox
                    disabled={disabled}
                    type={type}
                    key={index}
                    name={name}
                    error={error}
                    multiline={true}
                    required={required}
                    placeholder={placeholder}
                    helperText={helperText}
                    onBlur={onBlur}
                    onChange={onChange}
                    label={label}
                    value={value}
                    id={id}
                    className={className}
                />
            );
        }
        if(inputType === RADIO) {
            return (
                <CommonRadioField
                    disabled={disabled}
                    required={required}
                    name={name}
                    placeholder={''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={label}
                    id={id}
                    className={className}
                    options={options}
                    helperText={helperText}
                />
            );
        }
        if(inputType === CHECKBOX) {
            return (
                <CommonCheckBoxField
                    disabled={disabled}
                    required={required}
                    name={name}
                    placeholder={''}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    label={label}
                    id={id}
                    className={className}
                    helperText={helperText}
                />
            );
        }
    }

    async function onClickSubmit() {
        let isValid = true;
        formState.forEach(item => {
            const formItem = fields.find(field => field.label === item.label);
            if (formItem && formItem.required && !item.value) {
                isValid = false
            }
        });

        if(isValid) {
            const values: {name: string; value: string}[] = [];
            formState.forEach(item => {
                const exist = fields.find(field => field.label === item.label);
                if(exist) {
                    values.push({
                        name: exist.name,
                        value: item.value
                    });
                }
            });
            const res = await onSubmit(values);
        }
        else {
            let newFormState: FormState[] = [];
            formState.forEach(item => {
                const formItem = fields.find(field => field.label === item.label);
                if (formItem && formItem.required && !item.value) {
                    newFormState.push({
                        ...item,
                        isTouched: true,
                        helperText: setErrorMessage(item.label)
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
                const field = fields.find(fieldItem => fieldItem.label === item.label);
                if(field) {
                    const error = errors.find(errorItem => errorItem[FIELD] === field.name);
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
        <Grid className={`${className} app-common-form`} container justify={'center'} direction={'column'}>
            {fields.map((option: ConfigField, index) => {
                return renderFields(option, index);
            })}

            <Grid container className={'button-section'}>
                <Grid item>
                    <Button variant="contained" onClick={clearForm} color={'secondary'}>Clear</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={onClickSubmit} color={'primary'}>
                        {submitButtonName ? submitButtonName : 'Submit'}
                    </Button>
                </Grid>
            </Grid>
            <Alert
                isAlertOpen={isAlertOpen}
                onAlertClose={setIsAlertOpen}
                severity={alert.severity}
                message={alert.message} />
        </Grid>
    );
};
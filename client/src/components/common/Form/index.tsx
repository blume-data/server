import React, {ChangeEvent, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {TextBox} from "./TextBox";
import {DropDown} from "./DropDown";
import {BIG_TEXT, ConfigField, DROPDOWN, FormType, TEXT} from "./interface";
import './style.scss';
import {ErrorMessagesType, FIELD, MESSAGE} from "@ranjodhbirkaur/constants";
import {Alert} from "../Toast";
import {PLEASE_PROVIDE_VALID_VALUES} from "../../../modules/authentication/pages/Auth/constants";

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
    const {className, fields, onSubmit, submitButtonName} = props;

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
        const {inputType, options, id, className, name, placeholder, required, type='text', label} = field;
        if (inputType === TEXT) {
            return (
                <TextBox
                    type={type}
                    key={index}
                    name={name}
                    error={hasError(label)}
                    required={required}
                    placeholder={placeholder}
                    helperText={getHelperText(label)}
                    onChange={(e) => changeValue(e, label, SET_VALUE_ACTION)}
                    onBlur={(e) => changeValue(e, label, SET_IS_TOUCHED_ACTION)}
                    label={label}
                    id={id}
                    value={getValue(label)}
                    className={className} />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    onBlur={(e) => changeValue(e, label, SET_IS_TOUCHED_ACTION)}
                    value={getValue(name)} options={options && options.length ? options : []}
                    onChange={(e) => changeValue(e, label, SET_VALUE_ACTION)}
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
                    onBlur={(e) => changeValue(e, label, SET_IS_TOUCHED_ACTION)}
                    onChange={(e) => changeValue(e, label, SET_VALUE_ACTION)}
                    label={label}
                    id={id}
                    value={getValue(name)}
                    className={className}  />
            );
        }
    }

    async function onClickSubmit() {
        let isValid = true;
        formState.forEach(item => {
            const formItem = fields.find(field => field.name === item.label);
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
            if (typeof res === 'string') {
                clearForm();
            }
            else if(res && res.length) {
                setFormErrors(res);
                if (res.length === 1 && !res[0][FIELD] && res[0][MESSAGE]) {
                    showAlert({message: res[0][MESSAGE], severity: "error"});
                }
                else {
                    showAlert({message: PLEASE_PROVIDE_VALID_VALUES, severity: "error"});
                }
            }
        }
        else {
            let newFormState: FormState[] = [];
            formState.forEach(item => {
                const formItem = fields.find(field => field.name === item.label);
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
                const error = errors.find(errorItem => errorItem[FIELD] === item.label);
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
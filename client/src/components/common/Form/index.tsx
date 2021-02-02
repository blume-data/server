import React, {ChangeEvent, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';

import {TextBox} from "./TextBox";
import {DropDown} from "./DropDown";
import {
    BIG_TEXT,
    CHECKBOX,
    ConfigField,
    DATE_FORM_FIELD_TYPE,
    DROPDOWN,
    FORMATTED_TEXT,
    FormType, JSON_TEXT,
    RADIO,
    TEXT,
    ONLY_DATE_FORM_FIELD_TYPE, REFERENCE_EDITOR
} from "./interface";
import './style.scss';
import {
    ErrorMessagesType,
    IsJsonString,
    FIELD,
    JSON_FIELD_TYPE,
    MESSAGE,
    REFERENCE_MODEL_TYPE, REFERENCE_MODEL_NAME
} from "@ranjodhbirkaur/constants";
import {Alert} from "../Toast";
import {PLEASE_PROVIDE_VALID_VALUES} from "../../../modules/authentication/pages/Auth/constants";
import {CommonRadioField} from "./CommonRadioField";
import {CommonCheckBoxField} from "./CommonCheckBoxField";
import {CommonButton} from "../CommonButton";

import loadable from "@loadable/component";
import {DateField} from "./DateField";
import {VerticalTab, VerticalTabPanel} from "../VerticalTab";
import {JsonEditor} from "./JsonEditor";
import ReferenceEditor from "./ReferenceEditor";

const HtmlEditor = loadable(() => import('../HtmlEditor'));

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
    const [tabValue, setTabValue] = React.useState<number>(0);
    const [filteredGroups, setFilteredGroups] = useState<string[]>([]);

    const [formState, setFormState] = useState<FormState[]>([]);
    const {className, groups, fields, onSubmit, submitButtonName, response='', clearOnSubmit=false, showClearButton=false} = props;

    function setErrorMessage(name: string) {
        return `${name} is required`;
    }

    function changeValue(event: any, field: string, action: string) {
        const value = event.target.value;
        let state: FormState[];

        function setHelperText(fieldItem: ConfigField, formStateItem: FormState, value: string) {

            const {max, inputType, min, required, type} = fieldItem;
            const {label} = formStateItem;

            if(max !== undefined || min!== undefined) {
                if(max !== undefined && max) {
                    if((inputType === BIG_TEXT || inputType === TEXT) && type === 'text') {
                        if(value.length > max && !(!required && (!value || value.length === 0))) {
                            return `${label} should have maximum ${max} characters`;
                        }
                    }
                    else if(inputType === TEXT && type === 'number') {
                        if(Number(value) > Number(max) && !(!required && !value)) {
                            return `${label} should be maximum ${max}`;
                        }
                    }
                }
                if(min !== undefined && min) {
                    if((inputType === BIG_TEXT || inputType === TEXT) && type === 'text') {
                        if(value.length < min && !(!required && (!value || value.length === 0))) {
                            return `${label} should have minimum ${min} characters`;
                        }
                    }
                    else if(inputType === TEXT && type === 'number') {
                        if(Number(value) < Number(min) && !(!required && !value)) {
                            return `${label} should be minimum ${min}`;
                        }
                    }
                }
            }
            if(inputType === JSON_TEXT) {
                if(!IsJsonString(value)) {
                    return `${label} is not a valid JSON`;
                }
            }

            return (!value && fieldItem.required) ? setErrorMessage(formStateItem.label) : ''
        }

        const fieldItem = fields.find(ranjodh => ranjodh.label === field);
        if(fieldItem) {
            if (action === SET_VALUE_ACTION) {
                state = formState.map((item) => {
                    if (item.label === field) {
                        return {
                            ...item,
                            value,
                            helperText: setHelperText(fieldItem, item, value)
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
                            helperText: setHelperText(fieldItem, item, item.value),
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
                let errorMessage = '';
                response.forEach((item, index) => {
                    errorMessage += `${index+1}. ${item.message}. `;
                })
                showAlert({message: errorMessage, severity: "error"});
            }
    }
    }, [response, clearOnSubmit]);

    /*Filter groups which have at least one child element*/
    useEffect(() => {
        if(groups && groups.length) {
            const h = groups.filter(group => {
                return fields.find(field => field.groupName === group);
            });
            setFilteredGroups(h);
        }
    }, [groups, fields]);

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

    /*set value in html editors*/
    function setHtmlEditorValue(value: string, label: string, action: string) {

        changeValue({target: {value}}, label, action);
    }

    function showAlert(alertParam: AlertType) {
        setIsAlertOpen(true);
        setAlertMessage({
            message: alertParam.message,
            severity: alertParam.severity
        });
    }

    function renderFields(field: ConfigField, index: number, groupId?: string) {
        const {inputType, options, groupName='', id, className, name, placeholder, required, type='text', label, disabled=false, descriptionText=''} = field;

        /*If group Id: Field is not grouped*/
        if(groupId && groupName !== groupId) {
            return null;
        }
        else if(!groupId && groupName) {
            return null;
        }

        function onChange(e: ChangeEvent<any>) {
            changeValue(e, label, SET_VALUE_ACTION)
        }

        function onBlur(e: ChangeEvent<any>) {
            changeValue(e, label, SET_IS_TOUCHED_ACTION)
        }

        const helperText = getHelperText(label);
        const value = getValue(label);
        const error = hasError(label);
        const classNames = `${className} form-field-container-wrapper ${error ? 'red-border' : ''}`;


        if(inputType === ONLY_DATE_FORM_FIELD_TYPE) {
            return (
                <DateField
                    descriptionText={descriptionText}
                    type={ONLY_DATE_FORM_FIELD_TYPE}
                    key={index}
                    name={name}
                    disabled={disabled}
                    error={error}
                    required={required}
                    placeholder={placeholder}
                    helperText={helperText}
                    onChange={(value: any) => {changeValue({target: {value}}, label, SET_VALUE_ACTION)}}
                    onBlur={onBlur}
                    label={label}
                    id={id}
                    value={value}
                    className={classNames}
                />
            );
        }
        if(inputType === DATE_FORM_FIELD_TYPE) {

            return (
                <DateField
                    descriptionText={descriptionText}
                    type={DATE_FORM_FIELD_TYPE}
                    key={index}
                    name={name}
                    disabled={disabled}
                    error={error}
                    required={required}
                    placeholder={placeholder}
                    helperText={helperText}
                    onChange={(value: any) => {changeValue({target: {value}}, label, SET_VALUE_ACTION)}}
                    onBlur={onBlur}
                    label={label}
                    id={id}
                    value={value}
                    className={classNames}
                />
            );
        }
        if (inputType === TEXT) {
            return (
                <TextBox
                    descriptionText={descriptionText}
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
                    className={classNames}
                />
            );
        }
        if(inputType === DROPDOWN) {
            return (
                <DropDown
                    descriptionText={descriptionText}
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
                    className={classNames}
                />
            );
        }
        if(inputType === BIG_TEXT) {
            return (
                <TextBox
                    descriptionText={descriptionText}
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
                    className={classNames}
                />
            );
        }
        if(inputType === JSON_TEXT) {
            return (
                <JsonEditor
                    descriptionText={descriptionText}
                    disabled={disabled}
                    type={type}
                    key={index}
                    name={name}
                    error={error}
                    required={required}
                    placeholder={placeholder}
                    helperText={helperText}
                    onBlur={onBlur}
                    onChange={onChange}
                    label={label}
                    value={value}
                    id={id}
                    className={classNames}
                />
            );
        }
        if(inputType === RADIO) {
            return (
                <CommonRadioField
                    descriptionText={descriptionText}
                    disabled={disabled}
                    required={required}
                    name={name}
                    placeholder={''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={label}
                    id={id}
                    className={classNames}
                    options={options}
                    helperText={helperText}
                />
            );
        }
        if(inputType === CHECKBOX) {
            return (
                <CommonCheckBoxField
                    descriptionText={descriptionText}
                    disabled={disabled}
                    required={required}
                    name={name}
                    placeholder={''}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    label={label}
                    id={id}
                    className={classNames}
                    helperText={helperText}
                />
            );
        }
        if(inputType === FORMATTED_TEXT) {

            return (
                <HtmlEditor
                    placeholder={placeholder}
                    className={`${classNames} html-editor`}
                    required={required}
                    name={name}
                    label={label}
                    setValue={(str: string) => setHtmlEditorValue(str, label, SET_VALUE_ACTION)}
                    value={value}
                />
            );
        }
        if(inputType === REFERENCE_EDITOR) {
            if(field.miscData) {
                return (
                    <ReferenceEditor
                        descriptionText={descriptionText}
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        className={classNames}
                        key={index}
                        label={label}
                        REFERENCE_MODEL_NAME={field.miscData[REFERENCE_MODEL_NAME]}
                        REFERENCE_MODEL_TYPE={field.miscData[REFERENCE_MODEL_TYPE]}
                    />
                );
            }
            return null;
        }
    }

    async function onClickSubmit() {
        let isValid = true;

        function setIsTouched() {
            let newFormState: FormState[] = [];
            formState.forEach(item => {
                const formItem = fields.find(field => field.label === item.label);
                if (formItem && formItem.required && !item.value) {
                    isValid = false;
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
        setIsTouched();

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

            {/*Render Group Fields*/}
            {
                filteredGroups && filteredGroups.length
                    ? <VerticalTab value={tabValue} setValue={setTabValue} tabs={filteredGroups}>
                        {
                            filteredGroups && filteredGroups.length
                                ? filteredGroups.map((groupName, index) => {
                                    const exist = fields.filter(ranjod => ranjod.groupName === groupName);
                                    if(exist && exist.length) {
                                        return (
                                            <VerticalTabPanel value={tabValue} index={index}>
                                                {exist.map((option: ConfigField) => {
                                                    if(option.groupName === groupName) {
                                                        return (
                                                            <>
                                                                {renderFields(option, index, groupName)}
                                                            </>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </VerticalTabPanel>
                                        );
                                    }
                                    return  null;
                                })
                                : null
                        }
                      </VerticalTab>
                : null
            }

            <Grid container className={'button-section'}>
                {
                    showClearButton
                    ? <Grid item><CommonButton name={'Clear'} onClick={clearForm} color={'secondary'} /></Grid>
                    : null
                }
                <Grid item>
                    <CommonButton
                        onClick={onClickSubmit}
                        name={submitButtonName ? submitButtonName : 'Submit'}
                        color={"primary"}
                    />
                </Grid>
            </Grid>
            <Alert
                isAlertOpen={isAlertOpen}
                onAlertClose={setIsAlertOpen}
                severity={alert.severity}
                message={alert.message}
            />
        </Grid>
    );
};
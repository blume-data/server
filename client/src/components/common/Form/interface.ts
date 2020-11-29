import {ErrorMessagesType} from "@ranjodhbirkaur/constants";

export const DROPDOWN = 'dropdown';
export const BIG_TEXT = 'bigText';
export const TEXT = 'text';
export const DATE_FORM_FIELD_TYPE = 'date';
export const TIME_FORM_FIELD_TYPE = 'time';
export const RADIO = 'radio';
export const CHECKBOX = 'check-box';
export const FORMATTED_TEXT = 'formatted-text';
export const JSON_TEXT = 'json';

export interface FormType {
    className: string;
    fields: ConfigField[];
    groups?: string[];
    submitButtonName?: string;
    onSubmit: (values: object[]) => void;
    response: string | ErrorMessagesType[];
    clearOnSubmit?: boolean;
    showClearButton?: boolean;
}

export interface OptionsType {
    label: string;
    value: string;
}

export interface FieldType {
    placeholder: string;
    value: string;
    id?: string;
    options?: OptionsType[];
    min?: number;
    max?: number;
    className: string;
    required: boolean;
    name: string;
    label: string;
    error?: boolean;
    helperText?: string;
    type?: string;
    disabled?: boolean;
    descriptionText?: string;
}

export interface ConfigField extends FieldType{
    inputType: string,
    groupName?: string;
}
import {ErrorMessagesType} from "@ranjodhbirkaur/constants";

export const DROPDOWN = 'dropdown';
export const BIG_TEXT = 'bigText';
export const TEXT = 'text';
export const RADIO = 'radio';
export const CHECKBOX = 'check-box';
export const FORMATTED_TEXT = 'formatted-text'

export interface FormType {
    className: string;
    fields: ConfigField[];
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
}
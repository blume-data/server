import {ErrorMessagesType} from "@ranjodhbirkaur/constants";

export const DROPDOWN = 'dropdown';
export const BIG_TEXT = 'bigText';
export const TEXT = 'text';
export const RADIO = 'radio';

export interface FormType {
    className: string;
    fields: ConfigField[];
    submitButtonName?: string;
    onSubmit: (values: object[]) => Promise<string | ErrorMessagesType[]>;
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
    className: string;
    required: boolean;
    name: string;
    label: string;
    error?: boolean;
    helperText?: string;
    type?: string;
}

export interface ConfigField extends FieldType{
    inputType: string,
}
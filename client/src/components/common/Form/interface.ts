import {ChangeEvent} from "react";

export const DROPDOWN = 'dropdown';
export const BIG_TEXT = 'bigText';
export const TEXT = 'text';

export interface FormType {
    className: string
    fields: ConfigField[]
}

export interface OptionsType {
    label: string;
    value: string;
}

export interface FieldType {
    placeholder: string,
    value: string,
    id?: string;
    onChange: (event: ChangeEvent<any>) => void;
    options?: OptionsType[],
    className: string,
    required: boolean,
    name: string,
}

export interface ConfigField extends FieldType{
    inputType: string,
}
import {ChangeEvent} from "react";

export interface FormType {
    className: string
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
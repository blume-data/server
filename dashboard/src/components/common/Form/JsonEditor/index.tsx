import React, {ChangeEvent} from "react";
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import {FieldType} from "../interface";
import {DescriptionText} from "../DescriptionText";
import {IsJsonString} from "@ranjodhbirkaur/constants";

interface JsonEditorProps extends FieldType{
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}
export const JsonEditor = (props: JsonEditorProps) => {
    const {id, className, label, required=false,
        onBlur, helperText, type, disabled=false, descriptionText='',
        onChange, error=false, value='', placeholder=''} = props;

    function onChangeJson(e: any) {
        const value = e.target.value;
        console.log('i love you ranjodhbir kaur', value);

        console.log('ís valid json', IsJsonString(value));
        onChange(e);
    }
    return (
        <Grid className={`${className} app-text-box`}>
            <FormControl className={'text-box-form-control'}>
                <TextField
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    error={error}
                    type={type}
                    helperText={helperText}
                    onBlur={onBlur}
                    multiline={true}
                    onChange={onChangeJson}
                    required={required}
                    id={id ? id : undefined}
                    label={label}
                    rows={10}
                />
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
};
import React, {ChangeEvent} from "react";
import {FormControl, Grid, TextField} from "@material-ui/core";
import './style.scss';
import {FieldType} from "../interface";

interface TextBoxType extends FieldType{
    multiline?: boolean;
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
    key: number;
}
export const TextBox = (props: TextBoxType) => {
    const {id, className, label, required=false,
        onBlur, helperText,
        onChange, error=false, value='', placeholder='', multiline=false, key} = props;
    return (
        <Grid className={`${className} app-text-box`} key={key}>
            <FormControl className={'text-box-form-control'}>
                <TextField
                    placeholder={placeholder}
                    value={value}
                    error={error}
                    helperText={helperText}
                    onBlur={onBlur}
                    multiline={multiline}
                    onChange={onChange}
                    required={required}
                    id={id ? id : undefined}
                    label={label}
                    variant="outlined" />
            </FormControl>
        </Grid>
    );
};
import React, {ChangeEvent} from "react";
import {FormControl, Grid, TextField} from "@material-ui/core";
import './style.scss';

interface TextBoxType {
    id?: string;
    className?: string;
    error?: boolean;
    label: string;
    required: boolean;
    onBlur: (event: ChangeEvent<any>) => void;
    onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    multiline?: boolean;
    placeholder: string;
    key: number;
}
export const TextBox = (props: TextBoxType) => {
    const {id, className, label, required=false,
        onBlur,
        onChange, error=false, value='', placeholder='', multiline=false, key} = props;
    return (
        <Grid className={`${className} app-text-box`} key={key}>
            <FormControl className={'text-box-form-control'}>
                <TextField
                    placeholder={placeholder}
                    value={value}
                    error={error}
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
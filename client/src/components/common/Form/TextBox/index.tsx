import React, {ChangeEvent} from "react";
import {FormControl, Grid, TextField} from "@material-ui/core";
import './style.scss';

interface TextBoxType {
    id?: string;
    className?: string;
    label: string;
    required: boolean;
    onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    multiline?: boolean;
    placeholder: string;
    key: number;
}
export const TextBox = (props: TextBoxType) => {
    const {id, className, label, required=false, onChange, value='', placeholder='', multiline=false, key} = props;
    return (
        <Grid className={`${className} app-text-box`} key={key}>
            <FormControl className={'text-box-form-control'}>
                <TextField
                    placeholder={placeholder}
                    value={value}
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
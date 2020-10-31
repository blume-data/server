import React, {ChangeEvent} from "react";
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import './style.scss';
import {FieldType} from "../interface";
import {DescriptionText} from "../DescriptionText";

interface TextBoxType extends FieldType{
    multiline?: boolean;
    type: string;
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}
export const TextBox = (props: TextBoxType) => {
    const {id, className, label, required=false,
        onBlur, helperText, type, disabled=false, descriptionText='',
        onChange, error=false, value='', placeholder='', multiline=false} = props;
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
                    multiline={multiline}
                    onChange={onChange}
                    required={required}
                    id={id ? id : undefined}
                    label={label}
                />
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
};
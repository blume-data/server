import React, {ChangeEvent} from "react";
import {randomString} from "../../../../utils/tools";
import {FormControl, Grid, InputLabel, MenuItem, Select, FormHelperText} from "@material-ui/core";
import './style.scss';
import {FieldType, OptionsType} from "../interface";

interface DropDownType extends FieldType{
    options: OptionsType[];
    index: number;
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}
export const DropDown = (props: DropDownType) => {

    const {options, id, className, name, onChange, onBlur,
        error=false, helperText,
        placeholder='', required=false, value, index} = props;
    const randomId = randomString();
    return (
        <Grid key={index} className={`${className} app-drop-down`} id={id ? id : undefined}>
            <FormControl className={'app-drop-down-form-control'} error={error}>
                <InputLabel id={randomId}>Age</InputLabel>
                <Select
                    className={'app-drop-down-select'}
                    name={name}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    labelId={randomId}
                    value={value}
                    required={required}
                    onChange={onChange}
                >
                    <MenuItem className={'app-drop-down-menu-item'} value="">
                        None
                    </MenuItem>
                    {
                        options &&
                        options.map(option => <MenuItem
                            className={'app-drop-down-menu-item'}
                            value={option.value}>{option.label}</MenuItem>)
                    }
                </Select>
                {error && helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
            </FormControl>
        </Grid>
    );
}
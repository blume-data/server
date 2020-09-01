import React from "react";
import {randomString} from "../../../../utils/tools";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@material-ui/core";
import './style.scss';
import {FieldType, OptionsType} from "../interface";

interface DropDownType extends FieldType{
    options: OptionsType[];
    index: number;
}
export const DropDown = (props: DropDownType) => {

    const {options, id, className, name, onChange, placeholder='', required=false, value, index} = props;
    const randomId = randomString();
    return (
        <Grid key={index} className={`${className} app-drop-down`} id={id ? id : undefined}>
            <FormControl className={'app-drop-down-form-control'}>
                <InputLabel id={randomId}>Age</InputLabel>
                <Select
                    className={'app-drop-down-select'}
                    name={name}
                    placeholder={placeholder}
                    labelId={randomId}
                    value={value}
                    required={required}
                    onChange={onChange}
                >
                    {
                        options &&
                        options.map(option => <MenuItem
                            className={'app-drop-down-menu-item'}
                            value={option.value}>{option.label}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Grid>
    );
}
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
            <FormControl className={'drop-down-form-control'}>
                <InputLabel id={randomId}>Age</InputLabel>
                <Select
                    name={name}
                    placeholder={placeholder}
                    labelId={randomId}
                    value={value}
                    required={required}
                    onChange={onChange}
                >
                    {
                        options &&
                        options.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Grid>
    );
}
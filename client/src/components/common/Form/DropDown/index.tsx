import React, {ChangeEvent} from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import './style.scss';
import {FieldType, OptionsType} from "../interface";
import {DescriptionText} from "../DescriptionText";

interface DropDownType extends FieldType{
    options: OptionsType[];
    index: number;
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}
export const DropDown = (props: DropDownType) => {

    const {options, id, className, name, onChange, onBlur, label,
        error=false, helperText, disabled=false, descriptionText = '',
        placeholder='', required=false, value, index} = props;
    const randomId = `${name.split(' ').join('-')}-${index}-drop-down-input-label`;
    return (
        <Grid key={index} className={`${className} app-drop-down`} id={id ? id : ''}>
            <FormControl className={'app-drop-down-form-control'} error={error} disabled={disabled}>
                <InputLabel id={randomId}>{label}</InputLabel>
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
                        options.map((option, index) => <MenuItem
                            key={index}
                            className={'app-drop-down-menu-item'}
                            value={option.value}>{option.label}</MenuItem>)
                    }
                </Select>
                {error && helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
                <DescriptionText description={descriptionText} />
            </FormControl>
        </Grid>
    );
};
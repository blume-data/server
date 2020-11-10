import React, {ChangeEvent, useState} from "react";
import {Grid} from "@material-ui/core";
import {TextBox} from "./TextBox";
import {FieldType} from "./interface";
import FormControl from "@material-ui/core/FormControl";
import {SearchMenuList} from "../SearchMenuList";
import {validMomentTimezones} from "@ranjodhbirkaur/constants";

interface DateFieldType extends FieldType{
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}

export const DateField = (props: DateFieldType) => {
    const {id, className, label, required=false, name,
        onBlur, helperText, type, disabled=false, descriptionText='',
        onChange, error=false, value='', placeholder=''} = props;

    const [dateValue, setDateValue] = useState<string>('');

    return (
        <Grid>
            <TextBox
                descriptionText={descriptionText}
                type={'date'}
                name={name}
                disabled={disabled}
                error={error}
                required={required}
                placeholder={placeholder}
                helperText={helperText}
                onChange={onChange}
                onBlur={onBlur}
                label={label}
                id={id}
                value={value}
                className={className}
            />
            <TextBox
                descriptionText={descriptionText}
                type={'time'}
                name={name}
                disabled={disabled}
                error={error}
                required={required}
                placeholder={placeholder}
                helperText={helperText}
                onChange={onChange}
                onBlur={onBlur}
                label={label}
                id={`${id}-time`}
                value={value}
                className={className}
            />
            <FormControl>
                <SearchMenuList options={validMomentTimezones.map(timeZone => {
                    return {
                        value: timeZone,
                        label: timeZone
                    }
                })} />
            </FormControl>
        </Grid>
    );
}
import React, {ChangeEvent, useState} from "react";
import {FormLabel, Grid} from "@material-ui/core";
import {TextBox} from "./TextBox";
import {FieldType} from "./interface";
import FormControl from "@material-ui/core/FormControl";
import {SearchMenuList} from "../SearchMenuList";
import {validMomentTimezones} from "@ranjodhbirkaur/constants";
import {DescriptionText} from "./DescriptionText";

interface DateFieldType extends FieldType{
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: (event: ChangeEvent<any>) => void;
}

export const DateField = (props: DateFieldType) => {
    const {id, className, label, required=false, name,
        onBlur, helperText, type, disabled=false, descriptionText='',
        onChange, error=false, value='', placeholder=''} = props;

    const [dateValue, setDateValue] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [timeZone, setTimeZone] = useState<string>('UCT');

    console.log('time', timeZone);

    return (
        <Grid className={'date-field'}>
            {/*Date*/}
            <FormLabel component="legend">{'date'}</FormLabel>
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
            <DescriptionText description={'date'}/>

            {/*Time*/}
            <FormLabel component="legend">{'time'}</FormLabel>
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
            <DescriptionText description={'time'} />

            {/*Timezone*/}
            <FormLabel component="legend">{'timezone'}</FormLabel>
            <SearchMenuList
                value={timeZone}
                onMenuChange={(value) => setTimeZone(value)}
                options={validMomentTimezones.map(timeZone => {
                return {
                    value: timeZone,
                    label: timeZone
                }
            })} />
            <DescriptionText description={'timezone'} />
        </Grid>
    );
}
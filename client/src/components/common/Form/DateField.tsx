import React, {ChangeEvent, useEffect, useState} from "react";
import {FormLabel, Grid} from "@material-ui/core";
import {TextBox} from "./TextBox";
import {FieldType} from "./interface";

import {SearchMenuList} from "../SearchMenuList";
import {validMomentTimezones} from "@ranjodhbirkaur/constants";
import {DescriptionText} from "./DescriptionText";

interface DateFieldType extends FieldType{
    onChange: (event: string) => void;
    onBlur: (event: ChangeEvent<any>) => void;

}

export const DateField = (props: DateFieldType) => {
    const {id, className, label, required=false, name,
        onBlur, helperText, disabled=false, descriptionText='',
        onChange, error=false, value='', placeholder=''} = props;

    const [dateValue, setDateValue] = useState<string>('');
    const [time, setTime] = useState<string>('00:00');
    const [timeZone, setTimeZone] = useState<string>('UCT');

    useEffect(() => {
        onChange(`${dateValue}_${time}_${timeZone}`);
    }, [time, dateValue, timeZone]);

    useEffect(() => {
        if(value) {
            const splitedValue = value.split('_');
            if(splitedValue && splitedValue.length) {
                if(splitedValue[0]) {
                    setDateValue(splitedValue[0]);
                }
                if(splitedValue[1]) {
                    setTime(splitedValue[1]);
                }
                if(splitedValue[2]) {
                    setTimeZone(splitedValue[2]);
                }
            }
        }
    }, [value]);

    function onChangeDate(e: any) {
        console.log('event', e.target.value);
        setDateValue(e.target.value);
    }

    function onChangeTime(e: any) {
        console.log('time', e.target.value);
        setTime(e.target.value);
    }

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
                onChange={onChangeDate}
                onBlur={onBlur}
                label={label}
                id={id}
                value={dateValue}
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
                onChange={onChangeTime}
                onBlur={onBlur}
                label={label}
                id={`${id}-time`}
                value={time}
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
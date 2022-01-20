import React, {ChangeEvent, useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {DATE_FORM_FIELD_TYPE, FieldType, ONLY_DATE_FORM_FIELD_TYPE} from "./interface";

import {SearchMenuList} from "../SearchMenuList";
import {validMomentTimezones} from "@ranjodhbirkaur/constants";
import {DescriptionText} from "./DescriptionText";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { DateTime } from 'luxon';
import {RenderHeading} from "../RenderHeading";

interface DateFieldType extends FieldType{
    onChange: (event: string) => void;
    onBlur: (event: ChangeEvent<any>) => void;
    miscData?: any;
}

export const DateField = (props: DateFieldType) => {
    const {id, className, label, required=false, name, type,
        onBlur, helperText, disabled=false, descriptionText='',miscData,
        onChange, error=false, value='', placeholder=''} = props;

    const [timeZone, setTimeZone] = useState<string>('UCT');
    const [finalValue, setFinalValue] = useState<string>('');

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

    function updateFinalValue() {
        if(selectedDate) {
            try {
                const timeStamp = DateTime.fromISO(selectedDate.toISOString()).setZone(timeZone, { keepLocalTime: true });
                const value = timeStamp.toString();
                onChange(value);
                setFinalValue(value);
            }
            catch (e) {
                setFinalValue('');
            }
        }
    }

    useEffect(() => {
        if(selectedDate) {
            updateFinalValue();
        }
    }, [selectedDate, timeZone]);

    useEffect(() => {
        if(value) {
            const timeStamp = DateTime.fromISO(value, {zone: timeZone});
            const hour = timeStamp.toFormat('hh:mm:a');
            setSelectedDate(new Date(`${timeStamp.toISODate()} ${hour}`));
        }
        else if(miscData && miscData.timeStamp) {
            setSelectedDate(miscData.timeStamp);
        }
        else {
            setSelectedDate(null);
        }
    }, []);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    /*set initial data*/
    useEffect(() => {
        if(miscData && miscData.timeStamp) {
            setSelectedDate(miscData.timeStamp);
        }
        if(miscData && miscData.timeZone) {
            setTimeZone(miscData.timeZone);
        }
    }, [miscData]);

    return (
        <Grid id={id ? id : ''} className={`date-field ${className ? className : ''}`}>

            <RenderHeading
                value={`${label}: ${finalValue}`}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around" direction={"column"}>
                    <KeyboardDatePicker
                        margin="normal"
                        id={`date-picker-dialog-${name}`}
                        label="Date"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        disabled={disabled}
                    />
                    <KeyboardTimePicker
                        disabled={disabled}
                        margin="normal"
                        id={`time-picker-${name}`}
                        label="Time"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        style={{display: `${type === ONLY_DATE_FORM_FIELD_TYPE ? 'none' : 'block' }`}}
                    />
                    {
                        type === DATE_FORM_FIELD_TYPE
                        ? <Grid>
                                <SearchMenuList
                                    value={timeZone}
                                    onMenuChange={(value) => setTimeZone(value)}
                                    options={validMomentTimezones.map(timeZone => {
                                        return {
                                            value: timeZone.value,
                                            label: timeZone.label
                                        }
                                    })} />
                                <DescriptionText description={'timezone'} />
                            </Grid>
                        : null
                    }
                    {
                        helperText ?<RenderHeading value={helperText} type={"para"}  /> : null
                    }
                </Grid>
            </MuiPickersUtilsProvider>

        </Grid>
    );
}
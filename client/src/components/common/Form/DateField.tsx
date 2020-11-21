import React, {ChangeEvent, useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {FieldType} from "./interface";

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

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    useEffect(() => {
        if(selectedDate) {
            try {
                const timeStamp = DateTime.fromISO(selectedDate.toISOString()).setZone(timeZone, { keepLocalTime: true });
                //timeStamp.setZone(timeZone);
                console.log('time stamp changed', timeStamp.toISO(), timeZone);
                onChange(timeStamp.toString());
            }
            catch (e) {

            }
        }
    }, [selectedDate]);

    useEffect(() => {
        if(value) {
            const timeStamp = DateTime.fromISO(value, {zone: timeZone});
            const hour = timeStamp.toFormat('hh:mm:a');
            setSelectedDate(new Date(`${timeStamp.toISODate()} ${hour}`));
        }
        else {
            setSelectedDate(new Date());
        }
    }, []);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    return (
        <Grid className={'date-field'}>


            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Date picker dialog"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                </Grid>
            </MuiPickersUtilsProvider>

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
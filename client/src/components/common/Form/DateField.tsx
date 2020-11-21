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

    const [timeZone, setTimeZone] = useState<string>('UCT');
    const [finalValue, setFinalValue] = useState<string>('');

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

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
        else {
            setSelectedDate(null);
            setTimeout(() => {
                setSelectedDate(new Date());
            });
        }
    }, []);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    return (
        <Grid className={'date-field'}>

            <h3>Timestamp value: {finalValue}</h3>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around" direction={"column"}>
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
                    <Grid>
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
                </Grid>
            </MuiPickersUtilsProvider>


        </Grid>
    );
}
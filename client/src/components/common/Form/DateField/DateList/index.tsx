import React, {useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import {validMomentTimezones} from '@ranjodhbirkaur/constants';
import TextField from "@material-ui/core/TextField";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: 400,
            maxWidth: 300,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export const DateList = () => {
    const [search, setSearch] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [timeZones, setTimeZones] = useState<string[]>([]);
    const classes = useStyles();

    useEffect(() => {

        if(search) {
            const filteredTimeZones = validMomentTimezones.filter(timeZone => {
                return timeZone.toLowerCase().includes(search.toLowerCase());
            });
            setTimeZones(filteredTimeZones);
        }
        else {
            setTimeZones(validMomentTimezones);
        }
    }, [search]);

    function onChange(e: any) {
        setSearch(e.target.value);
    }

    function renderRow(props: ListChildComponentProps) {
        const { index, style } = props;

        function onClick() {
            setSelectedValue(timeZones[index]);
        }

        return (
            <ListItem button style={style} key={index} onClick={onClick}>
                <ListItemText primary={`${timeZones[index]}`} />
            </ListItem>
        );
    }

    console.log('selc', selectedValue);

    return (
        <Grid className={'date-list'}>
            <TextField value={search} placeholder={'Search Timezone'} onChange={onChange} />
            <div className={classes.root}>
                <FixedSizeList height={300} width={300} itemSize={46} itemCount={timeZones.length}>
                    {renderRow}
                </FixedSizeList>
            </div>
        </Grid>
    );
}
import React, {useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from "@material-ui/core/TextField";
import {Grid} from "@material-ui/core";
import './style.scss';
import List from "@material-ui/core/List";

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

interface OptionType {
    label: string;
    value: string;
}

interface SearchMenuListProps {
    options: OptionType[];
    value: string;
    onMenuChange: (value: string) => void;
}

export const SearchMenuList = (props: SearchMenuListProps) => {
    const [search, setSearch] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [timeZones, setTimeZones] = useState<OptionType[]>([]);
    const [hide, setHide] = useState<boolean>(true);
    const classes = useStyles();

    const {options, value, onMenuChange} = props;

    useEffect(() => {
        setSelectedValue(value);
        setSearch(value);
    }, []);

    useEffect(() => {
        setTimeZones(options);
    }, [options]);

    useEffect(() => {

        if(search) {
            const filteredTimeZones = options.filter(timeZone => {
                return timeZone.value.toLowerCase().includes(search.toLowerCase());
            });
            setTimeZones(filteredTimeZones);
        }
        else {
            setTimeZones(options);
        }
    }, [search]);

    function onChange(e: any) {
        setSearch(e.target.value);
    }

    function renderRow(timeZone: OptionType, index: number) {

        function onClick() {
            setSelectedValue(timeZone.value);
            setSearch(timeZone.value);
            setHide(true);
            setTimeout(() => {
                onMenuChange(timeZone.value);
            });
        }

        return (
            <ListItem
                button
                selected={timeZone.value === selectedValue}
                key={index}
                onClick={onClick}>
                <ListItemText primary={`${timeZone.value}`} />
            </ListItem>
        );
    }

    function onBlurTextSearch() {
        setTimeout(() => setHide(true));
    }
    console.log('tilmeZones', timeZones)

    return (
        <Grid className={'search-menu-list'}>
            <TextField
                onFocus={() => setHide(false)}
                onBlur={onBlurTextSearch}
                value={hide ? selectedValue : search}
                placeholder={'Search'}
                onChange={onChange} />
            <div className={`${classes.root} list`} style={{display: `${hide ? 'none' : 'block'}`}}>
                <List className={'fixed-size-list'}>
                    {timeZones.map(renderRow)}
                </List >
            </div>
        </Grid>
    );
}
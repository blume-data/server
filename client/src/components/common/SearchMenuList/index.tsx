import React, {useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import TextField from "@material-ui/core/TextField";
import {Grid} from "@material-ui/core";
import './style.scss';

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
    }, [])

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

    function renderRow(props: ListChildComponentProps) {
        const { index, style } = props;

        function onClick() {
            setSelectedValue(timeZones[index].value);
            setHide(true);
            setTimeout(() => {
                onMenuChange(selectedValue);
            });
        }

        return (
            <ListItem
                button
                style={style}
                className={`${timeZones[index].value === selectedValue ? 'selected' : ''}`}
                key={index}
                onClick={onClick}>
                <ListItemText primary={`${timeZones[index].value}`} />
            </ListItem>
        );
    }

    return (
        <Grid className={'search-menu-list'}>
            <TextField
                onFocus={() => setHide(false)}
                value={hide ? selectedValue : search}
                placeholder={'Search'}
                onChange={onChange} />
            <div className={`${classes.root} list`} style={{display: `${hide ? 'none' : 'block'}`}}>
                <FixedSizeList height={200} width={300} itemSize={46} itemCount={timeZones.length}>
                    {renderRow}
                </FixedSizeList>
            </div>
        </Grid>
    );
}
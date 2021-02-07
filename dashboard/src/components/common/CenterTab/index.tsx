import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './index.scss';
import Grid from "@material-ui/core/Grid";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            className={'center-tab-item'}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
}));

interface CenterTabProps {
    headings: string[];
    items: any[];
}

export const CenterTab = (props: CenterTabProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const {headings, items} = props;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <div className={`${classes.root} center-tab-container`}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="tabs selector"
                >
                    {
                        headings.map((heading, index) => {
                            return <Tab key={index} label={heading} {...a11yProps(index)} />
                        })
                    }
                </Tabs>
            </AppBar>
            <Grid
                container
                className={'swipeable'}
                //onChangeIndex={handleChangeIndex}
            >
                {
                    items.map((item, index) => {
                        return (
                            <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                                {item}
                            </TabPanel>
                        );
                    })
                }


            </Grid>
        </div>
    );
}

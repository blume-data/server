import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import './style.scss';

interface VerticalTabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

interface VerticalTabProps {
    tabs: string[];
    children: any;
    value: number;
    setValue: any;
}

export function VerticalTabPanel(props: VerticalTabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            className={'vertical-tab-panel'}
            {...other}
        >
            {value === index
            && (
                <Box
                    className={'vertical-tab-box-container'}
                    p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: '400px'
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export const VerticalTab = (props: VerticalTabProps) => {
    const classes = useStyles();
    const {tabs, children, value, setValue} = props;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={`${classes.root} vertical-tab-container`}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs"
                className={classes.tabs}
            >
                {tabs.map((tab, index) => {
                    return <Tab
                        className={value === index ? 'selected' : ''}
                        label={tab}
                        {...a11yProps(index)}
                    />
                })}

            </Tabs>
            {children}
        </div>
    );
}
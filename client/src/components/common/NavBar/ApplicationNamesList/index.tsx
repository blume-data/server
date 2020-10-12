import React, {useEffect, useState} from "react";
import {getItemFromLocalStorage} from "../../../../utils/tools";
import {APPLICATION_NAMES} from "@ranjodhbirkaur/constants";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

interface ApplicationNamesListProps {
    onApplicationNameMenuClose: any;
    applicationNameMenuAnchor: HTMLElement | null;
    onSelectApplicationName: (name: string) => void;

}
export const ApplicationNamesList = (props: ApplicationNamesListProps) => {

    const [applicationNames, setApplicationNames] = useState<string[] | null>(null);
    const {onApplicationNameMenuClose, applicationNameMenuAnchor, onSelectApplicationName} = props;

    function updateApplicationNames() {
        const s = getItemFromLocalStorage(APPLICATION_NAMES);
        if(s) {
            setApplicationNames(JSON.parse(s));
        }
    }

    // fetch the data routes
    useEffect(() => {
        updateApplicationNames();
    },[]);


    return (
        <Menu
            id="nav-bar-application-name-menu"
            anchorEl={applicationNameMenuAnchor}
            keepMounted
            open={Boolean(applicationNameMenuAnchor)}
            onClose={onApplicationNameMenuClose}
        >
            {
                applicationNames && applicationNames.map(applicationName => {
                    return (
                        <MenuItem
                            onClick={() => onSelectApplicationName(applicationName)}
                            key={applicationName}>
                            {applicationName}
                        </MenuItem>
                    );
                })
            }
        </Menu>
    );
};
import React from "react";
import Button from '@material-ui/core/Button';
import {Tooltip} from "@material-ui/core";

export const CommonButton = (props: {
    name: string;
    onClick?: () => void;
    color?: 'primary' | 'secondary',
    variant?: "contained" | "text" | "outlined" | undefined;
    title?: string;
}) => {

    const {name, onClick=null, color='primary', variant='contained', title} = props;

    function onButtonClick() {
        if(onClick) {
            onClick();
        }
    }

    return (
        <Tooltip title={title ? title : name} aria-label={title ? title : name}>
            <Button
                onClick={onButtonClick}
                variant={variant}
                color={color}>
                {name}
            </Button>
        </Tooltip>
    );
}
import React from "react";
import Button from '@material-ui/core/Button';

export const CommonButton = (props: {
    name: string;
    onClick?: () => void;
    color?: 'primary' | 'secondary',
    variant?: string;
}) => {

    const {name, onClick=null, color='primary', variant='contained'} = props;

    function onButtonClick() {
        if(onClick) {
            onClick();
        }
    }

    return (
        <Button
            onClick={onButtonClick}
            variant={variant}
            color={color}>
            {name}
        </Button>
    );
}
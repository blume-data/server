import React from "react";
import Button from '@material-ui/core/Button';

export const CommonButton = (props: {name: string; onClick?: () => void; color?: 'primary' | 'secondary'}) => {

    const {name, onClick=null, color='primary'} = props;

    function onButtonClick() {
        if(onClick) {
            onClick();
        }
    }

    return (
        <Button
            onClick={onButtonClick}
            variant="contained"
            color={color}>
            {name}
        </Button>
    );
}
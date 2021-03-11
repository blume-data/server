import React from "react";
import Button from '@material-ui/core/Button';
import {HeadingTypeInterface, RenderHeading} from "../RenderHeading";

;

export const CommonButton = (props: {
    name: string;
    onClick?: () => void;
    color?: 'primary' | 'secondary',
    variant?: "contained" | "text" | "outlined" | undefined;
    title?: string;
    type?: HeadingTypeInterface;
    className?: string;

}) => {

    const {name, onClick=null, color='primary', variant='contained', title, type='secondary', className=''} = props;

    function onButtonClick() {
        if(onClick) {
            onClick();
        }
    }

    const buttonTitle = title ? title : name;

    return (
        <Button
            className={className}
            onClick={onButtonClick}
            variant={variant}
            color={color}>
            <RenderHeading type={type} value={name} />
        </Button>
    );
}
import React from "react";
import Button from '@material-ui/core/Button';
import {HeadingTypeInterface, RenderHeading} from "../RenderHeading";
import './style.scss';

export const CommonButton = (props: {
    name: string;
    onClick?: () => void;
    color?: 'primary' | 'secondary',
    variant?: "contained" | "text" | "outlined" | undefined;
    title?: string;
    type?: HeadingTypeInterface;
    className?: string;
    startIcon?: React.ReactNode;
}) => {

    const {name, startIcon, onClick=null, color='primary', variant='contained', title, type='secondary', className=''} = props;

    function onButtonClick() {
        if(onClick) {
            onClick();
        }
    }

    return (
        <div className="common-button-container">
            <Button
                className={className}
                onClick={onButtonClick}
                variant={variant}
                startIcon={startIcon}
                color={color}>
                <RenderHeading type={type} value={name} />
            </Button>
        </div>
    );
}
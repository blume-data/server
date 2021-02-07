import {Tooltip} from "@material-ui/core";
import React from "react";

interface RenderHeadingType {
    title: string;
    className?: string;
    value: string;
}

export const RenderHeading = (props: RenderHeadingType) => {
    const {title, className, value} = props;
    return (
        <Tooltip title={title} >
            <h3 className={className ? className : ''}>
                {value}
            </h3>
        </Tooltip>
    );
}
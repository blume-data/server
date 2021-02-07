import {Tooltip} from "@material-ui/core";
import React from "react";
import './style.scss';

export type HeadingTypeInterface = 'main' | 'primary' | 'secondary' | 'para';

interface RenderHeadingType {
    title: string;
    className?: string;
    value: string;
    type?: HeadingTypeInterface
}

export const RenderHeading = (props: RenderHeadingType) => {
    const {title, className, value, type = 'secondary'} = props;
    return (
        <div className={'heading-container'}>
            <Tooltip title={title} >
                <h3 className={`${className ? className : ''} heading ${type}`}>
                    {value}
                </h3>
            </Tooltip>
        </div>
    );
}
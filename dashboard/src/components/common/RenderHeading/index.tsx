import React from "react";
import './style.scss';

export type HeadingTypeInterface = 'main' | 'primary' | 'secondary' | 'para';

interface RenderHeadingType {
    className?: string;
    value?: string;
    type?: HeadingTypeInterface;
    children?: React.ReactNode
}

export const RenderHeading = (props: RenderHeadingType) => {
    const {className, value, type = 'secondary', children} = props;
    return (
        <div className={'heading-container'}>
            <h3 className={`${className ? className : ''} heading ${type}`}>
                {children ? children : value}
            </h3>
        </div>
    );
}
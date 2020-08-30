import React from "react";
export default function ResizableBox({children, height = 300, style = {}, className}) {
    return (
        <div
            style={{
                width: `100%`,
                overflow: 'hidden',
                height: `${height}px`,
                ...style
            }}
            className={className}
        >
            {children}
        </div>
    );
}

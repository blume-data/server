import React, {useEffect, useState} from "react";
import './toast.scss';
export const Toast = (props: { errors: string | null }) => {

    const [hasErrors, setHasErrors] = useState<boolean>(true);

    useEffect(() => {
        setHasErrors(!!props.errors);
    }, [props.errors]);

    if (props.errors) {
        return (
            <div id={'toast'} className={`${hasErrors ? 'show' : ''}`} >
                {props.errors}
            </div>
        );
    }
    else return null;
};
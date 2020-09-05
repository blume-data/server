import React, {useEffect, useState} from "react";
import './toast.scss';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
export const Toast = (props: { errors: string | null }) => {

    const [hasErrors, setHasErrors] = useState<boolean>(true);

    useEffect(() => {
        setHasErrors(!!props.errors);
    }, [props.errors]);

    if (props.errors) {
        return (
            <Paper elevation={3} className={`${hasErrors ? 'show' : ''} app-toast`} >
                <Typography variant="subtitle2">
                    {props.errors}
                </Typography>
            </Paper>
        );
    }
    else return null;
};
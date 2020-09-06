import React from "react";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export interface AlertType extends AlertProps{
    message: string;
    severity?: 'success' | 'error' | 'info'
}

export const Alert = (props: AlertType) => {
    const {severity = 'success'} = props;
    return <MuiAlert elevation={6} severity={severity} variant="outlined" {...props}>{props.message}</MuiAlert>;
};
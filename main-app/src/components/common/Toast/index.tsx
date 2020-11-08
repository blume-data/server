import React from "react";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Snackbar from "@material-ui/core/Snackbar";

export interface AlertType extends AlertProps{
    severity?: 'success' | 'error' | 'info',
    isAlertOpen: boolean;
    onAlertClose: (action: boolean) => void;
    message: string;
}

export const Alert = (props: AlertType) => {
    const {severity = 'success', message, isAlertOpen, onAlertClose} = props;

    const handleAlertClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        onAlertClose(false);
    };

    return (
        <Snackbar open={isAlertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
            <MuiAlert elevation={3} onClose={handleAlertClose} severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};
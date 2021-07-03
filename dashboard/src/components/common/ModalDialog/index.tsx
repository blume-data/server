import React, {Suspense} from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import './style.scss';

const Dialog = React.lazy(() => import('@material-ui/core/Dialog'));

const styles = (theme: Theme) => createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

interface ModalDialogType {
    title: string;
    children: JSX.Element;
    handleClose: () => void;
    isOpen: boolean;
    className?: string;
}

function ModalDialogCode(props: ModalDialogType) {

    const {isOpen, children, handleClose, title, className} = props;

    return (
        <Suspense fallback="">
            <Dialog className={`dialog-modal-container ${className}`} onClose={handleClose} aria-labelledby={`dialog-title-${title}`} open={isOpen}>
            <DialogTitle id={`dialog-title-${title}`} onClose={handleClose}>
                {title}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
        </Suspense>
    );
}

export default function ModalDialog(props: ModalDialogType) {
    return (
        <Suspense fallback="">
            <ModalDialogCode {...props} />
        </Suspense>
    );
}

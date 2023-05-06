import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@mui/styles";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "./style.scss";
import Dialog from "@mui/material/Dialog";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0
    },
    closeButton: {
      position: "absolute",
      color: 'gray',
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
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    
  },
}))(MuiDialogContent);

interface ModalDialogType {
  title: string;
  children: JSX.Element;
  handleClose: () => void;
  isOpen: boolean;
  className?: string;
}

export default function ModalDialog(props: ModalDialogType) {
  const { isOpen, children, handleClose, title, className } = props;

  return (
    <Dialog
      className={`dialog-modal-container ${className}`}
      onClose={handleClose}
      aria-labelledby={`dialog-title-${title}`}
      open={isOpen}
    >
      <DialogTitle id={`dialog-title-${title}`} onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}

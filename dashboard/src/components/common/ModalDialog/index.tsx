import React from "react";
// import {
//   createStyles,
//   withStyles,
//   WithStyles,
// } from "@mui/styles";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "./style.scss";
import Dialog from "@mui/material/Dialog";

// const styles = () =>
//   createStyles({
//     root: {
//       margin: 0
//     },
//     closeButton: {
//       position: "absolute",
//       color: 'gray',
//     },
//   });

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = ((props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={''} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={''}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = (MuiDialogContent);

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


import { SyntheticEvent } from 'react'
import Snackbar from "@mui/material/Snackbar";

export interface AlertType {
  severity?: "success" | "error" | "info";
  isAlertOpen: boolean;
  onAlertClose: (action: boolean) => void;
  message: string;
}

export const Alert = (props: AlertType) => {
  const { severity = "success", message, isAlertOpen, onAlertClose } = props;

  const handleAlertClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    onAlertClose(false);
  };

  return (
    <div>
      {/* <MuiAlert elevation={3} onClose={handleAlertClose} severity={severity}>
                {message}
            </MuiAlert> */}
    </div>
  );
};

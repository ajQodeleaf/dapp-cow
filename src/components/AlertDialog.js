import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
} from "@mui/material";

function AlertDialog(props) {
  const { onClose, open, orderId, chainName, alert } = props;

  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push(`/${chainName}/home`);
  };

  const handleSwitchNetwork = () => {
    onClose();
    router.push(`/${chainName}/home`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="400px"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {orderId !== "" && (
        <>
          <DialogTitle id="alert-dialog-title">Order ID</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <a
                href={`https://explorer.cow.fi/${chainName}/orders/${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Order ID on CoW Explorer : {orderId}
              </a>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </>
      )}
      {alert && (
        <>
          <DialogTitle id="alert-dialog-title">Switch Network</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography>Please switch to Goerli Testnet.</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSwitchNetwork}>Switch Network</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default AlertDialog;

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function ErrorBar(props) {
  return (
    <Snackbar action="" open={props.active}>
      <Alert severity="warning" sx={{ width: "100%" }} onClose={(props) => props.close()}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}

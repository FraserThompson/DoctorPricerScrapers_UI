import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export default function Stats(props) {
  if (props.data && props.data.length > 0) {
    return <Box sx={{ p: 2 }}></Box>;
  } else {
    return <CircularProgress />;
  }
}

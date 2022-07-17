import { Box, Typography } from "@mui/material";
import React from "react";

export default function TabPanel({ p, children, value, index, ...other }) {
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: p != undefined ? p : 2 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
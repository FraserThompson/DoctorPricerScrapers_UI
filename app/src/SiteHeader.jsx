import React, { useContext } from "react";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import Login from "./Login";
import { AppContext } from "./ScraperApp";

export default function SiteHeader() {
  const appContext = useContext(AppContext);
  return (
    <Paper
      elevation={3}
      square
      sx={{
        backgroundColor: "primary.dark",
        p: 1,
        boxSizing: "border-box",
        height: "60px",
      }}
    >
      <Typography variant="h4" sx={{ color: "white", display: "inline-block" }}>
        DoctorPricer Data
      </Typography>
      <Box sx={{ display: "inline-block", paddingLeft: 1 }}>
        {appContext.username && (
          <Typography
            variant="h6"
            sx={{ color: "white", display: "inline-block" }}
          >
            Logged in as {appContext.username}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "inline-block", float: "right" }}>
        <Login />
      </Box>
    </Paper>
  );
}

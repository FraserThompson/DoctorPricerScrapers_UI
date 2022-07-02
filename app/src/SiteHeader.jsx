import React, { useState } from "react";
import config from "config";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import Login from "./Login";

export default function SiteHeader() {
    
  const [sessionToken, setSessionToken] = useState(
    sessionStorage.getItem("dpSessionToken")
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem("dpUsername")
  );

  function handleLogin(token, username) {
    sessionStorage.setItem("dpSessionToken", token);
    sessionStorage.setItem("dpUsername", username);
    setSessionToken(token);
    setUsername(username);
  }

  function handleLogout() {
    sessionStorage.removeItem("dpSessionToken");
    sessionStorage.removeItem("dpUsername");
    setSessionToken("");
    setUsername("");
  }

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
        DoctorPricer Stats
      </Typography>
      <Box sx={{ display: "inline-block", paddingLeft: 1 }}>
        {username && (
          <Typography
            variant="h6"
            sx={{ color: "white", display: "inline-block" }}
          >
            Logged in as {username}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "inline-block", float: "right" }}>
        <Login
          apiUrl={config.apiUrl}
          sessionToken={sessionToken}
          loginCallback={handleLogin}
          logoutCallback={handleLogout}
        />
      </Box>
    </Paper>
  );
}

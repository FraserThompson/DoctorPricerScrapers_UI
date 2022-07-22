import React, { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Login from "./Login";
import { AppContext } from "./ScraperApp";

export default function SiteHeader({ handleLeftToggle, handleRightToggle }) {
  const appContext = useContext(AppContext);
  return (
    <AppBar
      elevation={3}
      position="fixed"
      sx={{
        backgroundColor: "primary.dark",
        p: 1,
        zIndex: 2000,
        boxSizing: "border-box",
      }}
    >
      <Toolbar variant="dense">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleLeftToggle}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: "white", flexGrow: 1 }}>
          DoctorPricer Data
        </Typography>
        {appContext.username && (
          <Typography
            variant="h6"
            sx={{ color: "white", display: "inline-block" }}
          >
            Logged in as {appContext.username}
          </Typography>
        )}
        <Login />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleRightToggle}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

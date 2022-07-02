import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Utils from "./Utils";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function Login(props) {
  const [active, setActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch(props.apiUrl + "/dp/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        props.loginCallback(data.token, username);
        setActive(!active);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    props.logoutCallback();
  };

  return (
    <>
      {!props.sessionToken && (
        <Button href="#" onClick={() => setActive(true)}>
          Login
        </Button>
      )}
      {props.sessionToken && (
        <Button href="#" onClick={handleLogout}>
          Logout
        </Button>
      )}
      <Dialog open={active} onClose={() => setActive(false)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={32}
          />
          <TextField
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={128}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActive(false)}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

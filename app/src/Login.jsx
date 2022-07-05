import React, { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { login } from "./API";
import { AppContext } from "./ScraperApp";

export default function Login() {
  const [active, setActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const appContext = useContext(AppContext);

  const handleLogin = async () => {
    const data = await login(username, password)
    
    sessionStorage.setItem("dpSessionToken", data.token);
    sessionStorage.setItem("dpUsername", username);

    appContext.setUsername(username)
    appContext.setSessionToken(data.token);

    setActive(!active);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dpSessionToken");
    sessionStorage.removeItem("dpUsername");

    appContext.setUsername(null)
    appContext.setSessionToken(null);
  };

  return (
    <>
      {!appContext.sessionToken && (
        <Button href="#" onClick={() => setActive(true)}>
          Login
        </Button>
      )}
      {appContext.sessionToken && (
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

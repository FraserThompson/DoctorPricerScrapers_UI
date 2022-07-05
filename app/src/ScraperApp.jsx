import React, { useEffect, useState } from "react";
import PHOList from "./PHOList";
import LogsList from "./LogsList";
import Error from "./Error";
import { Grid, Paper, ThemeProvider } from "@mui/material";

import "./css/theme.css";

import { createTheme } from "@mui/material/styles";
import { getPhoList } from "./API";
import Home from "./Home";
import SiteHeader from "./SiteHeader";

const theme = createTheme({
  palette: {
    primary: {
      light: "#33a0d6",
      main: "#005f8e",
      dark: "#0089CC",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const initialState = { error: null, id: null, state: null };
const initialContext = {
  selected: null,
  taskStates: {},
  sessionToken: null,
  username: null,
  setTaskState: () => {},
  getTaskState: () => {},
  setGlobalError: () => {},
  setSessionToken: () => {},
  setUsername: () => {},
};
export const AppContext = React.createContext(initialContext);

export default function ScraperApp() {
  const [phoList, setPhoList] = useState([]);
  const [error, setGlobalError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [taskStates, setTaskStates] = useState({});
  const [sessionToken, setSessionToken] = useState(
    sessionStorage.getItem("dpSessionToken")
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem("dpUsername")
  );

  // Get the list on app start
  useEffect(() => {
    const fetchData = async () => {
      const phoList = await getPhoList();
      const states = phoList.reduce((acc, pho) => {
        acc[pho.module] = {
          id: pho.current_task_id
        }
        return acc;
      }, {})
      console.log(states)
      setTaskStates(states);
      setPhoList(phoList);
    };
    fetchData();
  }, []);

  function setTaskState(moduleName, state) {
    const newTaskStates = { ...taskStates };
    newTaskStates[moduleName] = state;
    setTaskStates(newTaskStates);
  }

  function getTaskState(moduleName) {
    return taskStates[moduleName];
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          selected,
          taskStates,
          sessionToken,
          username,
          setTaskState,
          getTaskState,
          setGlobalError,
          setSessionToken,
          setUsername,
        }}
      >
        <SiteHeader />
        <Grid container>
          <Grid item xs={4}>
            <Paper
              elevation={3}
              square
              style={{ height: "calc(100vh - 60px)", overflow: "auto" }}
            >
              <PHOList
                list={phoList}
                handleSelect={(item) => setSelected(item)}
              />
            </Paper>
          </Grid>
          <Grid item xs={8}>
            {selected && <LogsList handleClose={() => setSelected(null)} />}
            {!selected && <Home />}
          </Grid>
        </Grid>
      </AppContext.Provider>
      <Error active={error} message={error}></Error>
    </ThemeProvider>
  );
}

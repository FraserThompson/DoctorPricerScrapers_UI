import React, { useEffect, useState } from "react";
import PHOList from "./PHOList";
import ScraperPanel from "./ScraperPanel";
import Error from "./Error";
import { Dialog, Grid, Paper, ThemeProvider, Typography } from "@mui/material";

import "./css/theme.css";

import { createTheme } from "@mui/material/styles";
import { getPhoList, getPractices, getRegions } from "./API";
import Map from "./Map";
import SiteHeader from "./SiteHeader";
import RegionList from "./RegionList";

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
  selectedPho: null,
  selectedRegion: null,
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
  const [filteredPhoList, setFilteredPhoList] = useState([]);
  const [practiceList, setPracticeList] = useState(null);
  const [regionList, setRegionList] = useState(null);

  const [error, setGlobalError] = useState(false);
  const [selectedPho, setSelectedPho] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
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
      const regionList = await getRegions();
      const states = phoList.reduce((acc, pho) => {
        acc[pho.module] = {
          id: pho.current_task_id,
        };
        return acc;
      }, {});
      setRegionList(regionList);
      setSelectedRegion(
        regionList.find((region) => region.name == "New Zealand")
      );
      setTaskStates(states);
      setPhoList(phoList);
      setFilteredPhoList(phoList);
    };
    fetchData();
  }, []);

  // When a region is selected...
  useEffect(() => {
    if (!regionList) return;

    if (selectedRegion.name == "New Zealand") {
      console.log("setting to new zealand");
      setPracticeList(null);
      setFilteredPhoList(phoList);
      return;
    }

    const fetchData = async () => {
      const region = await getRegions({
        name: selectedRegion.name,
        practices: "yes",
      });
      if (region && region.length) {
        setPracticeList(region[0]["practices"]);
        setFilteredPhoList(
          phoList.filter((pho) => region[0]["phos"].includes(pho.id))
        );
      }
    };

    fetchData();
  }, [selectedRegion]);

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
          selectedPho,
          selectedRegion,
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
          <Grid item lg={3} xl={2}>
            <Paper
              elevation={3}
              square
              style={{ height: "calc(100vh - 60px)", overflow: "auto" }}
            >
              {regionList && (
                <RegionList
                  data={regionList.filter(
                    (region) => region.name != "New Zealand"
                  )}
                  handleSelect={(item) =>
                    setSelectedRegion(
                      item ||
                        regionList.find(
                          (region) => region.name == "New Zealand"
                        )
                    )
                  }
                  selected={selectedRegion}
                />
              )}
            </Paper>
          </Grid>
          <Grid item lg={6} xl={8}>
            <Map
              regionList={regionList}
              practiceList={practiceList}
              selectedRegion={selectedRegion}
              handleSelect={setSelectedRegion}
            />
          </Grid>
          <Grid item lg={3} xl={2}>
            <Paper
              elevation={3}
              square
              style={{ height: "calc(100vh - 60px)", overflow: "auto" }}
            >
              <PHOList
                data={filteredPhoList}
                handleSelect={(item) => setSelectedPho(item)}
                selected={selectedPho}
              />
              {phoList && selectedPho && (
                <Dialog
                  fullScreen
                  open={selectedPho != null}
                  onClose={() => setSelectedPho(null)}
                >
                  <ScraperPanel handleClose={() => setSelectedPho(null)} />
                </Dialog>
              )}
            </Paper>
          </Grid>
        </Grid>
      </AppContext.Provider>
      <Error active={error} message={error}></Error>
    </ThemeProvider>
  );
}

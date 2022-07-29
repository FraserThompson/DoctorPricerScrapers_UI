import React, { useEffect, useState } from "react";
import PHOList from "./PHOList";
import ScraperPanel from "./ScraperPanel";
import Error from "./Error";
import {
  Dialog,
  Drawer,
  Grid,
  Paper,
  SwipeableDrawer,
  ThemeProvider,
  Typography,
} from "@mui/material";

import "./css/theme.css";

import { createTheme } from "@mui/material/styles";
import { getPhoList, getPractices, getRegions } from "./API";
import MapWrapper from "./map/MapWrapper";
import SiteHeader from "./SiteHeader";
import RegionList from "./RegionList";
import RightPanel from "./RightPanel";
import { Box } from "@mui/system";
import DataPanel from "./DataPanel";

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
  selectedPractice: null,
  taskStates: {},
  sessionToken: null,
  username: null,
  age: 25,
  setSelectedRegion: () => {},
  setAge: () => {},
  setTaskState: () => {},
  getTaskState: () => {},
  setGlobalError: () => {},
  setSessionToken: () => {},
  setUsername: () => {},
};
export const AppContext = React.createContext(initialContext);

export default function ScraperApp() {
  const [age, setAge] = useState(25);

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [phoList, setPhoList] = useState([]);
  const [filteredPhoList, setFilteredPhoList] = useState([]);
  const [practiceList, setPracticeList] = useState(null);
  const [regionList, setRegionList] = useState(null);

  const [error, setGlobalError] = useState(false);
  const [selectedPho, setSelectedPho] = useState(null);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [defaultRegion, setDefaultRegion] = useState(null);

  const [taskStates, setTaskStates] = useState({});

  const [sessionToken, setSessionToken] = useState(
    sessionStorage.getItem("dpSessionToken")
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem("dpUsername")
  );

  const onInit = () => {
    const fetchData = async () => {
      const phoList = await getPhoList();
      const regionList = await getRegions();

      const states = phoList.reduce((acc, pho) => {
        acc[pho.module] = {
          id: pho.current_task_id,
        };
        return acc;
      }, {});

      const nz = regionList.find((region) => region.name == "New Zealand");
      const regions = regionList.filter(
        (region) => region.name != "New Zealand"
      );

      setRegionList(regions);
      setDefaultRegion(nz);

      setTaskStates(states);

      setPhoList(phoList);
      setFilteredPhoList(phoList);
    };
    fetchData();
  };

  const onRegionSelect = () => {
    if (!regionList) return;

    setPracticeList(null);

    if (!selectedRegion) {
      setPracticeList(null);
      setFilteredPhoList(phoList);
      return;
    }

    const fetchData = async () => {
      const region = await getRegions({
        name: selectedRegion.name,
        practices: true,
      });
      if (region && region.length) {
        setPracticeList(region[0]["practices"]);
        setFilteredPhoList(
          phoList.filter((pho) => region[0]["phos"].includes(pho.id))
        );
      }
    };

    fetchData();
  };

  // Get the list on app start
  useEffect(onInit, []);

  // When a region is selected...
  useEffect(onRegionSelect, [selectedRegion]);

  async function setTaskState(moduleName, state) {
    const oldTaskState = taskStates[moduleName];

    // If we're done scraping, fetch it all again
    if (
      oldTaskState == "scraping" &&
      (state == "Done" || state == "Error" || state == "Stopped")
    ) {
      const phoList = await getPhoList();
      setPhoList(phoList);
      onRegionSelect();
    }

    const newTaskStates = { ...taskStates };
    newTaskStates[moduleName] = state;
    setTaskStates(newTaskStates);
  }

  function getTaskState(moduleName) {
    return taskStates[moduleName];
  }

  const leftDrawer = (
    <Paper elevation={3} square sx={{ paddingTop: "62px" }}>
      {regionList && (
        <>
          <RegionList
            data={regionList}
            handleSelect={setSelectedRegion}
            selected={selectedRegion}
          />
          <DataPanel regions={regionList} />
        </>
      )}
    </Paper>
  );

  const rightDrawer = (
    <Paper elevation={3} square sx={{ paddingTop: "62px" }}>
      <RightPanel
        phoList={filteredPhoList}
        practiceList={practiceList}
        selectedPho={selectedPho}
        selectedPractice={selectedPractice}
        handleSelectPho={(item) => setSelectedPho(item)}
        handleSelectPractice={(item) => setSelectedPractice(item)}
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
  );

  const mobileDisplay = { xs: "block", sm: "block", md: "block", lg: "none" };
  const desktopDisplay = { xs: "none", lg: "none", md: "none", lg: "block" };

  const sidebarWidth = "300px";

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          selectedPho,
          defaultRegion,
          selectedRegion,
          selectedPractice,
          taskStates,
          sessionToken,
          username,
          age,
          setSelectedRegion,
          setAge,
          setTaskState,
          getTaskState,
          setGlobalError,
          setSessionToken,
          setUsername,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <SiteHeader
            handleLeftToggle={() => setLeftOpen(!leftOpen)}
            handleRightToggle={() => setRightOpen(!rightOpen)}
          />
          <SwipeableDrawer
            variant="temporary"
            open={leftOpen}
            onClose={() => setLeftOpen(!leftOpen)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: mobileDisplay,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarWidth,
              },
            }}
          >
            {leftDrawer}
          </SwipeableDrawer>
          <Drawer
            variant="permanent"
            sx={{
              flexShrink: 0,
              display: desktopDisplay,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarWidth,
              },
            }}
            open
          >
            {leftDrawer}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            <MapWrapper
              regionList={regionList}
              practiceList={practiceList}
              defaultRegion={defaultRegion}
              selectedRegion={selectedRegion}
              selectedPractice={selectedPractice}
              handleSelectRegion={setSelectedRegion}
              handleSelectPractice={setSelectedPractice}
            />
          </Box>
          <SwipeableDrawer
            variant="temporary"
            open={rightOpen}
            anchor="right"
            onClose={() => setRightOpen(!rightOpen)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: mobileDisplay,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarWidth,
              },
            }}
          >
            {rightDrawer}
          </SwipeableDrawer>
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              flexShrink: 0,
              display: desktopDisplay,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarWidth,
              },
            }}
            open
          >
            {rightDrawer}
          </Drawer>
        </Box>
      </AppContext.Provider>
      <Error active={error} message={error}></Error>
    </ThemeProvider>
  );
}

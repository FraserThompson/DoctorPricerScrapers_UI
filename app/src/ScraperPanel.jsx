import React, { useContext, useEffect, useState } from "react";
import LogsListItem from "./LogsListItem";
import moment from "moment";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

import {
  AppBar,
  Box,
  ButtonGroup,
  Card,
  CardHeader,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import TabPanel from "./TabPanel";
import Averages from "./Averages";
import PriceHistory from "./PriceHistory";
import {
  getLogsList,
  getPHOPriceHistory,
  getSessionToken,
  startScraping,
  stopScraping,
  submitData,
} from "./API";
import { AppContext } from "./ScraperApp";
import ReactJson from "react-json-view";

export default function ScraperPanel({ handleClose }) {
  const [tab, setTab] = useState(0);
  const [list, setList] = useState([]);
  const [priceHistory, setPricehistory] = React.useState(null);

  const sessionToken = getSessionToken();

  const appContext = useContext(AppContext);

  const fetchData = async () => {
    const logs = await getLogsList(appContext.selectedPho.module);
    const priceHistory = await getPHOPriceHistory(
      appContext.selectedPho.module
    );
    setPricehistory(priceHistory);
    setList(logs);
  };

  useEffect(() => {
    fetchData();
  }, [appContext.selectedPho]);

  useEffect(() => {
    const state = appContext.getTaskState(appContext.selectedPho.module);

    // If we have state and we haven't already started checking
    if (state && state.state == "Done") {
      fetchData();
    }
  }, [appContext.taskStates]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  async function handleScrape() {
    const state = appContext.getTaskState(appContext.selectedPho.module);

    if (state && state.id) {
      appContext.setGlobalError("Can't scrape, already scraping");
      return false;
    }

    const response = await startScraping(appContext.selectedPho.module);

    if (!response.error) {
      console.log("Scraping: " + appContext.selectedPho.module);
      const newState = {
        error: null,
        id: response.data.task_id,
        state: "Scraping",
      };
      appContext.setTaskState(appContext.selectedPho.module, newState);
    } else {
      console.error(response);
      const newState = {
        error: JSON.stringify(response.error),
        id: null,
        state: "Error",
      };
      appContext.setTaskState(appContext.selectedPho.module, newState);
    }
  }

  async function handleSubmit() {
    const response = await submitData(appContext.selectedPho.module);

    if (!response.error) {
      const newState = {
        error: null,
        id: response.data.task_id,
        state: "Submitting",
      };
      appContext.setTaskState(appContext.selectedPho.module, newState);
    } else {
      const newState = {
        error: JSON.stringify(response.error),
        id: null,
        state: "Error",
      };
      appContext.setTaskState(appContext.selectedPho.module, newState);
    }
  }

  async function handleStop() {
    const state = appContext.getTaskState(appContext.selectedPho.module);
    const task_id = state ? state.id : appContext.selectedPho.current_task_id;

    if (!task_id) {
      console.log("Can't stop because we're not doing anything");
      return false;
    }

    const data = await stopScraping(task_id, appContext.selectedPho.module);

    const newState = { error: null, id: null, state: "Stopped" };
    appContext.setTaskState(appContext.selectedPho.module, newState);
  }

  const state = appContext.getTaskState(appContext.selectedPho.module);

  return (
    <>
      {appContext.selectedPho != null && (
        <Card variant="outlined" sx={{ marginTop: "62px" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {appContext.selectedPho.name}
            </Typography>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                href={
                  "https://api.doctorpricer.co.nz/dp/api/practices/?pho=" +
                  appContext.selectedPho.name
                }
                target="_blank"
                color="success"
              >
                View all practices
              </Button>
              {appContext.selectedPho.website && (
                <Button href={appContext.selectedPho.website}>
                  PHO Website
                </Button>
              )}
            </ButtonGroup>
          </Toolbar>
          <Box sx={{ p: 1 }}>
            <Box>
              {sessionToken && appContext.selectedPho.module && (
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleScrape}
                    disabled={state && state.state == "Scraping"}
                  >
                    {state && state.state == "Scraping" ? "Scraping" : "Scrape"}
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={state && state.state == "Submitting"}
                  >
                    {state && state.state == "Submitting"
                      ? "Submitting"
                      : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="error"
                    onClick={handleStop}
                  >
                    Stop
                  </Button>
                </ButtonGroup>
              )}
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="Data" />
              <Tab label="Last Scrape" />
              <Tab label="Submission History" />
            </Tabs>
          </Box>
          <TabPanel
            value={tab}
            index={0}
            style={{ overflow: "auto", height: "75vh" }}
          >
            <Typography variant="h6">
              Total Practices:{" "}
              <strong>{appContext.selectedPho.number_of_practices}</strong>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>
                {Number(
                  (appContext.selectedPho.number_enrolling /
                    appContext.selectedPho.number_of_practices) *
                    100
                ).toFixed(2)}
                % enrolling
              </strong>{" "}
              ({appContext.selectedPho.number_enrolling} enrolling,{" "}
              {appContext.selectedPho.number_notenrolling} not enrolling)
            </Typography>
            <Typography variant="h6">Average fees for PHO by age</Typography>
            <Averages data={appContext.selectedPho.average_prices} />
            {priceHistory && <PriceHistory data={priceHistory} />}
          </TabPanel>
          <TabPanel
            value={tab}
            index={1}
            padding={0}
            style={{ overflow: "auto", height: "75vh" }}
          >
            <ReactJson theme="pop" src={appContext.selectedPho.last_scrape} />
          </TabPanel>
          <TabPanel
            value={tab}
            index={2}
            style={{ overflow: "auto", height: "75vh" }}
          >
            {list ? (
              list.map((item, index) => {
                return (
                  <LogsListItem
                    key={index}
                    date={item.date}
                    id={item.id}
                    scraped={item.scraped}
                    warnings={item.warnings}
                    errors={item.errors}
                    changes={item.changes}
                  />
                );
              })
            ) : (
              <CircularProgress />
            )}
          </TabPanel>
        </Card>
      )}
    </>
  );
}

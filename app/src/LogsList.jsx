import React, { useContext, useEffect, useState } from "react";
import LogsListItem from "./LogsListItem";
import moment from "moment";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

import { Box, ButtonGroup, Card, CardHeader, Typography } from "@mui/material";

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

export default function LogsList({ handleClose }) {
  const [tab, setTab] = useState(0);
  const [list, setList] = useState([]);
  const [priceHistory, setPricehistory] = React.useState(null);

  const sessionToken = getSessionToken();

  const appContext = useContext(AppContext);

  const fetchData = async () => {
    const logs = await getLogsList(appContext.selected.module);
    const priceHistory = await getPHOPriceHistory(appContext.selected.name);
    setPricehistory(processPriceHistoryData(priceHistory));
    setList(logs);
  };

  useEffect(() => {
    fetchData();
  }, [appContext.selected]);

  useEffect(() => {
    const state = appContext.getTaskState(appContext.selected.module);

    // If we have state and we haven't already started checking
    if (state && state.state == "Done") {
      fetchData();
    }
  }, [appContext.taskStates]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  async function handleScrape() {
    const state = appContext.getTaskState(appContext.selected.module);

    if (state) {
      console.log("Not scraping because we're already scraping");
      return false;
    }

    const response = await startScraping(appContext.selected.module);

    if (!response.error) {
      console.log("Scraping: " + appContext.selected.module);
      const newState = {
        error: null,
        id: response.data.task_id,
        state: "Scraping",
      };
      appContext.setTaskState(appContext.selected.module, newState);
    } else {
      console.log(response);
      const newState = {
        error: JSON.stringify(response.error),
        id: null,
        state: "Error",
      };
      appContext.setTaskState(appContext.selected.module, newState);
    }
  }

  async function handleSubmit() {
    const response = await submitData(appContext.selected.module);

    if (!response.error) {
      const newState = {
        error: null,
        id: response.data.task_id,
        state: "Submitting",
      };
      appContext.setTaskState(appContext.selected.module, newState);
    } else {
      const newState = { error: JSON.stringify(response.error), id: null, state: "Error" };
      appContext.setTaskState(appContext.selected.module, newState);
    }
  }

  async function handleStop() {
    const state = appContext.getTaskState(appContext.selected.module);

    const task_id = state ? state.id : appContext.selected.current_task_id;

    if (!task_id) {
      console.log("Can't stop because we're not doing anything");
      return false;
    }

    const data = await stopScraping(task_id);

    const newState = { error: null, id: null, state: "Stopped" };
    appContext.setTaskState(appContext.selected.module, newState);
  }

  const processPriceHistoryData = (data) => {
    const labels = [];
    const averages = [[], [], [], [], []];
    
    data.forEach(({ fields }) => {
      if (Object.keys(fields.average_prices).length !== 0) {
        const date = moment(fields.history_date);

        if (!labels.includes(date)) {
          labels.push(date);

          averages[0].push(fields.average_prices[2].average);
          averages[1].push(fields.average_prices[3].average);
          averages[2].push(fields.average_prices[4].average);
          averages[3].push(fields.average_prices[5].average);
          averages[4].push(fields.average_prices[6].average);
        }
      }
    });

    return { labels, averages };
  };

  const state = appContext.getTaskState(appContext.selected.module);

  return (
    <>
      {appContext.selected != null && (
        <Card variant="outlined">
          <CardHeader
            action={
              <>
                <Button
                  href={
                    "https://api.doctorpricer.co.nz/dp/api/practices/?pho=" +
                    appContext.selected.name
                  }
                  target="_blank"
                  color="success"
                >
                  View all practices
                </Button>

                <IconButton onClick={handleClose}>X</IconButton>
              </>
            }
            title={appContext.selected.name}
          />
          <Box sx={{ p: 1 }}>
            <Box>
              {appContext.selected.website && (
                <Button href={appContext.selected.website}>Website</Button>
              )}
            </Box>
            <Box>
              {sessionToken && appContext.selected.module && (
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
              <Tab label="Averages" />
              <Tab label="Last Scrape" />
              <Tab label="Submission History" />
            </Tabs>
          </Box>
          <TabPanel
            value={tab}
            index={0}
            style={{ overflow: "auto", height: "73vh" }}
          >
            <Typography variant="h5">Average fees for PHO by age</Typography>
            <Averages data={appContext.selected.average_prices} />
            {priceHistory && <PriceHistory data={priceHistory} />}
          </TabPanel>
          <TabPanel
            value={tab}
            index={1}
            style={{ overflow: "auto", height: "73vh" }}
          >
            <pre>
              {JSON.stringify(appContext.selected.last_scrape, null, 2)}
            </pre>
          </TabPanel>
          <TabPanel
            value={tab}
            index={2}
            style={{ overflow: "auto", height: "73vh" }}
          >
            {list ? (
              list.map((item, index) => {
                return (
                  <LogsListItem
                    key={index}
                    date={item.date}
                    id={item.id}
                    scraped={JSON.stringify(item.scraped, null, 2)}
                    scraped_count={item.scraped.length}
                    warnings={JSON.stringify(item.warnings, null, 2)}
                    warnings_count={item.warnings.length}
                    errors={JSON.stringify(item.errors, null, 2)}
                    errors_count={item.errors.length}
                    changes={JSON.stringify(item.changes, null, 2)}
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

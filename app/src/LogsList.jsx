import React from "react";
import LogsListItem from "./LogsListItem";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper, Typography } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import TabPanel from "./TabPanel";

export default function LogsList(props) {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if (props.list) {
    var logsList = props.list.map(function (item, index) {
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
    }, this);
  } else {
    var logsList = <CircularProgress />;
  }

  const AverageModel = {
    age: { type: Number },
    average: { type: Number },
  };

  return (
    <>
      {props.selected != null && (
        <Box>
          <Box sx={{ p: 1 }}>
            <Typography variant="h4">
              {props.selected.props.name}

              <span style={{ float: "right" }}>
                <IconButton onClick={props.close}>X</IconButton>
              </span>
            </Typography>
            <Box>
              {props.selected.website && (
                <Button
                  href={props.selected.props.website}
                  label={props.selected.props.website}
                ></Button>
              )}
              <Button
                href={
                  "https://api.doctorpricer.co.nz/dp/api/practices/?pho=" +
                  props.selected.props.name
                }
                target="_blank"
                label="View all practices"
              ></Button>
              {props.sessionToken && props.selected.props.module && (
                <div>
                  <Button type="submit" onClick={props.scrape}>
                    Scrape
                  </Button>
                  <Button type="submit" onClick={props.submit}>
                    Submit
                  </Button>
                  <Button type="submit" color="error" onClick={props.stop}>
                    Stop
                  </Button>
                </div>
              )}
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="Last Scrape" />
              <Tab label="Submission History" />
              <Tab label="Averages" />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <pre>
              {JSON.stringify(props.selected.props.last_scrape, null, 2)}
            </pre>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {logsList}
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Typography variant="h5">Average fees for PHO by age</Typography>
            <TableContainer component={Paper}>
              <Table style={{ marginTop: 10 }}>
                <TableHead>
                  <TableCell>Age</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>13</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>65</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    {props.selected.props.average_prices.length &&
                      props.selected.props.average_prices.map((item, idx) => (
                        <TableCell key={idx}>
                          ${item.average && parseFloat(item.average).toFixed(2)}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6">Raw Data</Typography>
            <pre>
              {JSON.stringify(props.selected.props.average_prices, null, 2)}
            </pre>
          </TabPanel>
        </Box>
      )}
    </>
  );
}

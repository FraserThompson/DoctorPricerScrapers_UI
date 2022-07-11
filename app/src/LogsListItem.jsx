import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import TabPanel from "./TabPanel";
import { formatDate } from "./Utils";
import ReactJson from "react-json-view";

export default function LogsListItem({
  date,
  changes,
  errors,
  warnings,
  scraped,
}) {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Card>
      <h2>{formatDate(date)}</h2>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label={"Errors " + errors.length} />
            <Tab label={"Warnings " + warnings.length} />
            <Tab label={"Changes " + Object.keys(changes).length} />
            <Tab label={"Submitted " + scraped.length}></Tab>
          </Tabs>
        </Box>
        <TabPanel padding={0} value={tab} index={0}>
          <ReactJson theme="pop" src={errors} />
        </TabPanel>
        <TabPanel padding={0} value={tab} index={1}>
          <ReactJson theme="pop" src={warnings} />
        </TabPanel>
        <TabPanel padding={0} value={tab} index={2}>
          <ReactJson theme="pop" src={changes} />
        </TabPanel>
        <TabPanel padding={0} value={tab} index={3}>
          <ReactJson theme="pop" src={scraped} />
        </TabPanel>
      </CardContent>
    </Card>
  );
}

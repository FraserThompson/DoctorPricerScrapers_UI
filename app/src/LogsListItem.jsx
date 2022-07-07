import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import TabPanel from "./TabPanel";
import { formatDate } from "./Utils";

export default function LogsListItem({date, changes, errors, warnings, scraped}) {
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
        <TabPanel value={tab} index={0}>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <pre>{JSON.stringify(warnings, null, 2)}</pre>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <pre>{JSON.stringify(changes, null, 2)}</pre>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <pre>{JSON.stringify(scraped, null, 2)}</pre>
        </TabPanel>
      </CardContent>
    </Card>
  );
}

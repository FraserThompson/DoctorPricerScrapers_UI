import React from "react";
import Utils from "./Utils";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";

export default function LogsListItem(props) {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Card>
      <h2>{Utils.formatDate(this.props.date)}</h2>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label={"Errors " + this.props.errors_count} />
            <Tab label={"Warnings " + this.props.warnings_count} />
            <Tab label={"Changes " + this.props.changes.length} />
            <Tab label={"Submitted " + this.props.scraped_count}></Tab>
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <pre>{this.props.errors}</pre>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <pre>{this.props.warnings}</pre>
        </TabPanel>
        <TabPanel value={tab} index={2}></TabPanel>
        <TabPanel value={tab} index={3}>
          <Tab label={"Changes"}>
            <pre>{this.props.changes}</pre>
          </Tab>
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <pre>{this.props.scraped}</pre>
        </TabPanel>
      </CardContent>
    </Card>
  );
}

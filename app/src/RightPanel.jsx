import React from "react";
import List from "@mui/material/List";
import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import TabPanel from "./TabPanel";
import PracticeList from "./PracticeList";
import PHOList from "./PHOList";

export default function RightPanel({
  phoList,
  practiceList,
  handleSelectPho,
  handleSelectPractice,
  selectedPho,
  selectedPractice,
  updateTask,
}) {
  const [openTab, setOpenTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setOpenTab(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={openTab} onChange={handleChange} aria-label="tabs">
          <Tab label="Scrapers" />
          {practiceList && <Tab label={"Practices (" + practiceList.length + ")"} />}
        </Tabs>
      </Box>
      <TabPanel p={0} value={openTab} index={0}>
        <List>
          <PHOList
            data={phoList}
            selected={selectedPho}
            handleSelect={handleSelectPho}
            updateTask={updateTask}
          />
        </List>
      </TabPanel>
      {practiceList && (
        <TabPanel p={0} value={openTab} index={1}>
          <List>
            <PracticeList
              data={practiceList}
              selected={selectedPractice}
              handleSelect={handleSelectPractice}
            />
          </List>
        </TabPanel>
      )}
    </>
  );
}

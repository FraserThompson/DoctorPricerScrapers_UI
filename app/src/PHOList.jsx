import React from "react";
import PHOListItem from "./PHOListItem";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import { ListSubheader } from "@mui/material";

export default function PHOList({ data, handleSelect, updateTask }) {
  let phoList = <CircularProgress />;

  if (data.length > 0) {
    phoList = data.map((pho, index) => {
      return (
        <PHOListItem
          key={index}
          pho={pho}
          handleSelect={handleSelect}
          updateTask={updateTask}
        />
      );
    });
  }

  return (
    <List>
      <ListSubheader>Scrapers</ListSubheader>
      {phoList}
    </List>
  );
}

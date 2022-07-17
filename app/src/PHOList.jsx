import React from "react";
import PHOListItem from "./PHOListItem";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";

export default function PHOList({ data, selected, handleSelect, updateTask }) {
  let phoList = <CircularProgress />;

  if (data && data.length > 0) {
    phoList = data.map((pho, index) => {
      return (
        <PHOListItem
          key={index}
          pho={pho}
          selected={selected}
          handleSelect={handleSelect}
          updateTask={updateTask}
        />
      );
    });
  }

  return (
    <List>
      {phoList}
    </List>
  );
}

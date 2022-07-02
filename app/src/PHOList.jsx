import React from "react";
import PHOListItem from "./PHOListItem";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";

export default function PHOList({list, handleSelect, updateTask}) {
  
  let phoList = <CircularProgress />;

  if (list.length > 0) {
    phoList = list.map((pho, index) => {
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

  return <List>{phoList}</List>;
}

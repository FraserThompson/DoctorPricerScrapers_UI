import React from "react";
import PracticeListItem from "./PracticeListItem";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";

export default function PracticeList({ data, selected, handleSelect }) {
  let practiceList = <CircularProgress />;

  if (data && data.length > 0) {
    practiceList = data.map((practice, index) => {
      return (
        <PracticeListItem
          key={index}
          practice={practice}
          selected={selected == index}
          handleSelect={() => handleSelect(index)}
        />
      );
    });
  }

  return (
    <List>
      {practiceList}
    </List>
  );
}

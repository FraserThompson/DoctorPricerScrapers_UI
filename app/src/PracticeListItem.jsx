import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function PracticeListItem({ practice, selected, handleSelect }) {
  return (
    <ListItemButton onClick={handleSelect} selected={selected}>
      <ListItemText
        primary={practice.name}
        secondary={practice.pho}
      ></ListItemText>
    </ListItemButton>
  );
}

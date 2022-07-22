import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ListItem } from "@mui/material";

export default function PracticeListItem({ practice, selected, handleSelect }) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleSelect} selected={selected}>
        <ListItemText
          primary={practice.name}
          secondary={practice.pho}
        ></ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

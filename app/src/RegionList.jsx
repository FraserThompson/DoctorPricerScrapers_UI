import React from "react";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { getRegionAverage } from "./map/MapInfoPanel";
import { useContext } from "react";
import { AppContext } from "./ScraperApp";

export default function RegionList({ data, handleSelect, selected }) {
  let list = <CircularProgress />;
  const context = useContext(AppContext)

  if (data && data.length > 0) {
    list = data.map((item, index) => {
      return (
        <ListItemButton
          selected={selected && item.name == selected.name}
          key={index}
          onClick={() => handleSelect(item)}
        >
          <ListItemIcon>
            <Typography variant="subtitle2">
              ${getRegionAverage(item, context.age)}
            </Typography>
          </ListItemIcon>
          <ListItemText primary={item.name}></ListItemText>
        </ListItemButton>
      );
    });
  }

  return (
    <List>
      <ListSubheader>Regions</ListSubheader>
      <ListItemButton
        selected={selected == null}
        onClick={() => handleSelect(null)}
      >
        <ListItemIcon></ListItemIcon>
        <ListItemText primary={"All"}></ListItemText>
      </ListItemButton>
      {list}
    </List>
  );
}

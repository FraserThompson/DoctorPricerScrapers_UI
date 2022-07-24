import React from "react";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { getRegionAverage } from "./Utils";
import { useContext } from "react";
import { AppContext } from "./ScraperApp";

export default function RegionList({ data, handleSelect, selected }) {
  let list = <CircularProgress />;
  const context = useContext(AppContext);

  if (data && data.length > 0) {
    list = data.map((item, index) => {
      return (
        <ListItem key={index} disablePadding>
          <ListItemButton
            selected={selected && item.name == selected.name}
            onClick={() => handleSelect(item)}
          >
            <ListItemIcon>
              <Typography variant="h5">
                ${getRegionAverage(item, context.age, 0)}
              </Typography>
            </ListItemIcon>
            <ListItemText primary={item.name}></ListItemText>
          </ListItemButton>
        </ListItem>
      );
    });
  }

  return (
    <List>
      <ListSubheader>Regions</ListSubheader>
      <ListItem disablePadding>
        <ListItemButton
          selected={selected == null}
          onClick={() => handleSelect(null)}
        >
          <ListItemIcon></ListItemIcon>
          <ListItemText primary={"All"}></ListItemText>
        </ListItemButton>
      </ListItem>
      {list}
    </List>
  );
}

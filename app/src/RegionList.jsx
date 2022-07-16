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

export default function RegionList({ data, handleSelect, selected }) {
  let list = <CircularProgress />;

  if (data && data.length > 0) {
    list = data.map((item, index) => {
      return (
        <ListItemButton
          selected={selected && item.name == selected.name}
          key={index}
          onClick={() => handleSelect(item)}
        >
          <ListItemIcon>
            <Typography variant="h5">
              {String(item.number_of_practices)}
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

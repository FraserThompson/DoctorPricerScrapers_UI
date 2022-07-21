import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "../ScraperApp";

export default function MapAgeSelector() {
  const ages = [0, 6, 14, 18, 25, 45, 65];

  const context = useContext(AppContext);

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      style={{
        top: "10px",
        right: "50px"
      }}
    >
      <Box p={2}>
        <FormControl fullWidth>
          <InputLabel id="age-select">Age</InputLabel>
          <Select
            labelId="age-select"
            id="age-select"
            value={context.age}
            label="Age"
            onChange={(e) => context.setAge(e.target.value)}
          >
            {ages.map((age) => (
              <MenuItem key={age} value={age}>
                {age}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}

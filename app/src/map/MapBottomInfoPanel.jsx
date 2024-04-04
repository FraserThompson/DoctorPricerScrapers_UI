import {
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Averages from "../Averages";
import PriceHistory from "../PriceHistory";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function MapBottomInfoPanel({ region }) {
  const [collapsed, setCollapsed] = useState(1);

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      sx={{
        height: collapsed == 1 ? "500px" : collapsed == 2 ? "80vh" : "20px",
        overflow: "hidden",
        transition: "height, width 0.2s",
        width: collapsed < 2 ? "40%" : "90%",
        bottom: "10px",
        right: "10px",
        display: { xs: "none", sm: "block", md: "block", lg: "block" }
      }}
    >
      <Box p={2}>
        <Grid container>
          <Grid item xs={12}>
          <IconButton
              ariba-label="maximize"
              onClick={() => setCollapsed(Math.min(collapsed + 1, 2))}
              style={{
                position: "absolute",
                top: "0px",
                right: "20px",
                padding: "0px",
              }}
            >
              {<KeyboardArrowUpIcon />}
            </IconButton>
            <IconButton
              ariba-label="minimize"
              onClick={() => setCollapsed(Math.max(collapsed - 1, 0))}
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                padding: "0px",
              }}
            >
              {<KeyboardArrowDownIcon />}
            </IconButton>
            <Typography variant="h6">
              {region.name}: Average fees by age
            </Typography>
            {region.averages ? (
              <Averages data={region.averages} />
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Grid item xs={12} sx={{height: collapsed == 2 ? "60vh" : "300px"}}>
            {region.price_history ? (
              <PriceHistory data={JSON.parse(region.price_history)} />
            ) : (
              <CircularProgress />
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

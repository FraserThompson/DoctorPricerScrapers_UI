import {
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Averages from "./Averages";
import PriceHistory from "./PriceHistory";

export default function MapBottomInfoPanel({ region }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      style={{
        height: !collapsed ? "330px" : "50px",
        overflow: "hidden",
        transition: "height 0.2s",
        width: "calc(100% - 100px)",
        bottom: "10px",
        left: "50px",
      }}
    >
      <Box p={2}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6">
              <IconButton
                ariba-label="minimize"
                onClick={() => setCollapsed(!collapsed)}
              >
                X
              </IconButton>
            </Typography>
            <Typography variant="h6">
              {region.name}: Average fees by age
            </Typography>
            {region.averages ? (
              <Averages data={region.averages} />
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Grid item xs={6}>
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

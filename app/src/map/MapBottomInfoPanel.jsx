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
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function MapBottomInfoPanel({ region }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      style={{
        height: !collapsed ? "330px" : "20px",
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
            <IconButton
              ariba-label="minimize"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                padding: "0px",
              }}
            >
              {!collapsed ? <CloseIcon /> : <KeyboardArrowUpIcon />}
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

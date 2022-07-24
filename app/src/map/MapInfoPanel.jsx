import { Box, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "../ScraperApp";
import { getRegionAverage, getRegionDifference } from "../Utils";

export default function MapInfoPanel({ region }) {
  const context = useContext(AppContext);
  const average = getRegionAverage(region, context.age);
  const regionDifference = getRegionDifference(
    average,
    context.age,
    context.defaultRegion
  );

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      style={{
        top: "10px",
        left: "50px",
      }}
    >
      <Box p={2}>
        <Typography variant="h6">{region.name}</Typography>
        <Typography variant="subtitle1">
          <strong>{region.number_of_practices}</strong> practices
        </Typography>
        <Typography variant="subtitle1">
          <strong>
            {Number(
              (region.number_enrolling / region.number_of_practices) * 100
            ).toFixed(2)}
            %
          </strong>{" "}
          enrolling
        </Typography>
        <Typography variant="subtitle1">
          <strong>${average}</strong> average{" "}
          {regionDifference != 0 && (
            <>
              (<PriceDifferenceIndicator percentage={regionDifference} />)
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
}

export function PriceDifferenceIndicator({ percentage }) {
  const color = percentage < 0 ? "green" : "red";
  return (
    <span style={{ color }}>
      {percentage > 0 ? "+" : ""}
      {percentage != 0 ? percentage + "%" : ""}
    </span>
  );
}

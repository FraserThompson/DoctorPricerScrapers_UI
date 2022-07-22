import { Box, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "../ScraperApp";

export const getRegionAverage = (region, age, decimalPoints = 2) => {
  const averageRow = region.averages.find(
    (average) => average.from_age__max == age
  );
  return averageRow
    ? Number(averageRow["price__avg"]).toFixed(decimalPoints)
    : 0;
};

export const getRegionDifference = (
  average,
  age,
  defaultRegion,
  decimalPoints = 2
) => {
  if (!defaultRegion) return 0;
  const regionAverage = getRegionAverage(defaultRegion, age, decimalPoints);
  return (((average - regionAverage) / regionAverage) * 100).toFixed(2);
};

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

function PriceDifferenceIndicator({ percentage }) {
  const color = percentage < 0 ? "green" : "red";
  return (
    <span style={{ color }}>
      {percentage > 0 ? "+" : ""}
      {percentage != 0 ? percentage + "%" : ""}
    </span>
  );
}

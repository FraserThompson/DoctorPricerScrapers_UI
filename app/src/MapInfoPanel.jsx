import { Box, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { MapContext } from "./Map";

export default function MapInfoPanel({ region }) {
  const context = useContext(MapContext);

  const getAveragePrice = () => {
    const averageRow = region.averages.find(
      (average) => average.from_age__max == context.age
    );
    return averageRow ? Number(averageRow["price__avg"]).toFixed(2) : 0;
  };

  return (
    <Paper
      elevation={3}
      className="map-info-box"
      style={{
        top: "10px",
        left: "50px"
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
          <strong>${getAveragePrice()}</strong> average
        </Typography>
      </Box>
    </Paper>
  );
}

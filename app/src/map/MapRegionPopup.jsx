import { Typography } from "@mui/material";
import React from "react";
import { getRegionAverage, getRegionDifference, getRegionMax } from "../Utils";
import { PriceDifferenceIndicator } from "./MapInfoPanel";

export default function MapRegionPopup({ region, age, defaultRegion }) {
  const average = getRegionAverage(region, age);
  const max = getRegionMax(region, age);
  const regionDifference = getRegionDifference(average, age, defaultRegion);

  return (
    <div>
      <Typography variant="subtitle1">{region.name}</Typography>
      <Typography variant="body2">
        <strong>{region.number_of_practices}</strong> practices
      </Typography>
      <Typography variant="body2">
        <strong>
          {Number(
            (region.number_enrolling / region.number_of_practices) * 100
          ).toFixed(2)}
          %
        </strong>{" "}
        enrolling
      </Typography>
      {average && (
        <>
          <Typography variant="body2">
            <strong>${Number(average).toFixed(2)}</strong> average{" "}
            {regionDifference != 0 && (
              <>
                (<PriceDifferenceIndicator percentage={regionDifference} />)
              </>
            )}
          </Typography>
          <Typography variant="body2">
            <strong>${Number(max).toFixed(2)}</strong> max
          </Typography>
        </>
      )}
    </div>
  );
}

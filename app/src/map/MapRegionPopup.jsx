import React from "react";
import ReactDOMServer from "react-dom/server";
import { getRegionAverage, getRegionDifference, getRegionMax } from "../Utils";
import { PriceDifferenceIndicator } from "./MapInfoPanel";

export default function MapRegionPopup(region, age, defaultRegion) {
  const average = getRegionAverage(region, age);
  const max = getRegionMax(region, age);
  const regionDifference = getRegionDifference(average, age, defaultRegion);

  const content = (
    <div>
      <h4>{region.name}</h4>
      <p>
        <strong>{region.number_of_practices}</strong> practices
      </p>
      <p>
        <strong>
          {Number(
            (region.number_enrolling / region.number_of_practices) * 100
          ).toFixed(2)}
          %
        </strong>{" "}
        enrolling
      </p>
      {average && (
        <>
          <p>
            <strong>${Number(average).toFixed(2)}</strong> average{" "}
            {regionDifference != 0 && (
              <>
                (<PriceDifferenceIndicator percentage={regionDifference} />)
              </>
            )}
          </p>
          <p>
            <strong>${Number(max).toFixed(2)}</strong> max
          </p>
        </>
      )}
    </div>
  );

  return ReactDOMServer.renderToString(content);
}

import React from "react";
import ReactDOMServer from "react-dom/server";

export default function MapRegionPopup(region, age) {
  const currentAverage = region.averages.find(
    (average) => average.from_age__max == age
  );

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
      {currentAverage && (
        <>
          <p>
            <strong>${Number(currentAverage["price__avg"]).toFixed(2)}</strong>{" "}
            average
          </p>
          <p>
            <strong>${Number(currentAverage["price__max"]).toFixed(2)}</strong>{" "}
            max
          </p>
        </>
      )}
    </div>
  );

  return ReactDOMServer.renderToString(content);
}

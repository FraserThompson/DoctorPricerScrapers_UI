import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContext } from "./Map";

export default function MapRegions({ regions, selected, handleSelect }) {
  const map = useMap();
  const [regionLayers, setRegionLayers] = useState(null);
  const [tooltips, setTooltips] = useState(null);
  const [tooltipIndexMap, setTooltipIndexMap] = useState(null);

  const context = useContext(MapContext);

  const getTooltipContent = (region) => {
    const currentAverage = region.averages.find(
      (average) => average.from_age__max == context.age
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
          <p>
            <strong>${Number(currentAverage["price__avg"]).toFixed(2)}</strong>{" "}
            average
          </p>
        )}
      </div>
    );

    return ReactDOMServer.renderToString(content)
  };

  const getRegionFromTooltipIndex = (i) => {
    const regionId = tooltipIndexMap[i];
    return regions.find((region) => region.id == regionId);
  };

  // Update markers when age changes
  useEffect(() => {
    tooltips && tooltips.forEach((tooltip, i) =>
      tooltip.setContent(getTooltipContent(getRegionFromTooltipIndex(i)))
    );
  }, [context.age]);

  // Fit bounds when region is selected
  useEffect(() => {
    if (!regionLayers) return;

    if (selected.name == "New Zealand") {
      map.fitBounds(regionLayers.getBounds());
      tooltips.forEach((tooltip) => tooltip.openOn(map));
      return;
    }

    tooltips.forEach((tooltip) => tooltip.close());

    const layer = regionLayers
      .getLayers()
      .find((layer) => layer.id == selected.id);
    map.fitBounds(layer.getBounds());
  }, [selected]);

  // On init
  useEffect(() => {
    if (!regions) return;

    const geoJsonGroup = L.geoJSON();
    geoJsonGroup.addTo(map);

    regions = regions.filter((region) => region.name != "New Zealand");

    // Add the region layers to the map
    regions.forEach((region, i) => {
      const geoJSON = JSON.parse(region.geojson);
      geoJsonGroup.addData(geoJSON);
    });

    // Add the overlays with the data
    let i = 0;
    const tooltips = [];
    const tooltipIndexMap = {};

    geoJsonGroup.eachLayer((layer) => {
      const bounds = layer.getBounds();
      const center = bounds.getCenter();
      const region = regions[i];

      layer.id = region.id;

      const content = getTooltipContent(region);

      const tooltip = L.tooltip({ permanent: true })
        .setLatLng(center)
        .setContent(content);

      tooltips.push(tooltip);
      tooltipIndexMap[i] = region.id;

      // Add to map then add click listener
      const tooltipEl = tooltip.addTo(map).getElement();
      tooltipEl.addEventListener("click", () => handleSelect(region));
      tooltipEl.style.pointerEvents = "auto";

      i += 1;
    });

    setTooltipIndexMap(tooltipIndexMap);
    setTooltips(tooltips);
    setRegionLayers(geoJsonGroup);

    map.fitBounds(geoJsonGroup.getBounds());
  }, [regions]);

  return <></>;
}

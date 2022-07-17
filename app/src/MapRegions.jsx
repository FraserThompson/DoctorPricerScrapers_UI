import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContext } from "./Map";
import MapRegionPopup from "./MapRegionPopup";

export default function MapRegions({ regions, selected, handleSelectRegion }) {
  const map = useMap();
  const [regionLayers, setRegionLayers] = useState(null);
  const [tooltips, setTooltips] = useState(null);
  const [tooltipIndexMap, setTooltipIndexMap] = useState(null);

  const context = useContext(MapContext);

  const getRegionFromTooltipIndex = (i) => {
    const regionId = tooltipIndexMap[i];
    return regions.find((region) => region.id == regionId);
  };

  // Update markers when age changes
  useEffect(() => {
    tooltips &&
      tooltips.forEach((tooltip, i) =>
        tooltip.setContent(MapRegionPopup(getRegionFromTooltipIndex(i), context.age))
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

      const content = MapRegionPopup(region, context.age);

      const tooltip = L.tooltip({ permanent: true })
        .setLatLng(center)
        .setContent(content);

      tooltips.push(tooltip);
      tooltipIndexMap[i] = region.id;

      // Add to map then add click listener
      const tooltipEl = tooltip.addTo(map).getElement();
      tooltipEl.addEventListener("click", () => handleSelectRegion(region));
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

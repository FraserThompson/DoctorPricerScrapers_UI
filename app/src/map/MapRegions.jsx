import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../ScraperApp";
import { Source, Layer, Popup, useMap } from "react-map-gl";
import polylabel from "polylabel";
import bbox from "@turf/bbox";
import MapRegionPopup from "./MapRegionPopup";

export default function MapRegions({ regions, selected, handleSelectRegion }) {
  const { current: map } = useMap();
  const [hovered, setHovered] = useState(null);
  const context = useContext(AppContext);

  // Fit bounds when region is selected
  useEffect(() => {
    if (!selected) {
      const initialJson = JSON.parse(context.defaultRegion.geojson);
      const bounds = bbox(initialJson);
      map.fitBounds(bounds);
      return;
    }
    const layer = map.getSource(selected.name + "-data").serialize();
    const bounds = bbox(layer.data);
    map.fitBounds(bounds);
  }, [selected]);

  // On init
  useEffect(() => {
    regions.forEach((region) => {
      map.on("click", region.name, () => handleSelectRegion(region));
      map.on("mousemove", region.name, () => setHovered(region));
      map.on("mouseleave", region.name, () => setHovered(null));
    });
  }, [regions]);

  return regions.map((region) => {
    const regionJson = JSON.parse(region.geojson);
    const labelCoords = polylabel(regionJson.coordinates, 1.0);

    return (
      <Source
        key={region.name}
        id={region.name + "-data"}
        type="geojson"
        data={regionJson}
      >
        <Layer
          type="fill"
          id={region.name}
          paint={{
            "fill-color":
              selected?.name == region.name ? "rgb(71, 255, 51)" : "#007cbf",
            "fill-opacity":
              hovered?.name == region.name && selected?.name != region.name
                ? 0.5
                : 0.2,
            "fill-outline-color": "black",
          }}
        />
        {selected?.name != region.name && (
          <Popup
            longitude={labelCoords[0]}
            latitude={labelCoords[1]}
            closeButton={false}
            closeOnClick={false}
            focusAfterOpen={false}
            anchor="bottom"
          >
            <MapRegionPopup
              region={region}
              defaultRegion={context.defaultRegion}
              age={context.age}
            />
          </Popup>
        )}
      </Source>
    );
  });
}

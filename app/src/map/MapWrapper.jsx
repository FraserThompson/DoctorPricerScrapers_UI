import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapRegions from "./MapRegions";
import MapMarkers from "./MapMarkers";
import MapInfoPanel from "./MapInfoPanel";
import MapBottomInfoPanel from "./MapBottomInfoPanel";
import MapAgeSelector from "./MapAgeSelector";

export default function MapWrapper({
  practiceList,
  regionList,
  selectedRegion,
  defaultRegion,
  selectedPractice,
  handleSelectPractice,
  handleSelectRegion,
}) {
  const getSelectedRegion = selectedRegion || defaultRegion;

  return (
    <>
      <Map
        initialViewState={{longitude: 178.11319654616165, latitude: -38.220168770389215, zoom: 3}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
        style={{
          width: "100%",
          height: "calc(100vh - 63px)",
        }}
      >
        {!getSelectedRegion && <CircularProgress />}
        {getSelectedRegion && <MapInfoPanel region={getSelectedRegion} />}
        {getSelectedRegion && <MapAgeSelector />}
        {
          <MapMarkers
            practiceList={practiceList}
            selected={selectedPractice}
            handleSelectPractice={handleSelectPractice}
          />
        }
        {regionList && (
          <MapRegions
            regions={regionList}
            selected={selectedRegion}
            handleSelectRegion={handleSelectRegion}
          />
        )}
        {getSelectedRegion && <MapBottomInfoPanel region={getSelectedRegion} />}
      </Map>
    </>
  );
}

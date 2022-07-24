import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import MapRegions from "./MapRegions";
import MapMarkers from "./MapMarkers";
import MapInfoPanel from "./MapInfoPanel";
import MapBottomInfoPanel from "./MapBottomInfoPanel";
import MapAgeSelector from "./MapAgeSelector";

export default function Map({
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
      <MapContainer
        center={[51.505, -0.09]}
        zoom={4.94}
        S
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "calc(100vh - 63px)",
        }}
      >
        {!getSelectedRegion && <CircularProgress />}
        {getSelectedRegion && <MapInfoPanel region={getSelectedRegion} />}
        {getSelectedRegion && <MapAgeSelector />}
        <TileLayer
          apikey="pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token={apikey}"
        />
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
      </MapContainer>
    </>
  );
}

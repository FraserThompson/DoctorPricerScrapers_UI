import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { getSessionToken } from "../API";
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
  selectedPractice,
  handleSelectPractice,
  handleSelectRegion,
}) {
  const sessionToken = getSessionToken();

  return (
    <Box p={0}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={4.94}
        S
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
        }}
      >
        {!selectedRegion && <CircularProgress />}
        {selectedRegion && <MapInfoPanel region={selectedRegion} />}
        {selectedRegion && <MapAgeSelector />}
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
        {selectedRegion && <MapBottomInfoPanel region={selectedRegion} />}
      </MapContainer>
      {/* {sessionToken && <AdminPanel />} */}
    </Box>
  );
}

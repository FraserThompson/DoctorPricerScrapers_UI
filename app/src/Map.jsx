import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { getSessionToken } from "./API";
import { MapContainer, TileLayer } from "react-leaflet";
import AdminPanel from "./AdminPanel";

import "leaflet/dist/leaflet.css";
import MapRegions from "./MapRegions";
import MapMarkers from "./MapMarkers";
import MapInfoPanel from "./MapInfoPanel";
import MapBottomInfoPanel from "./MapBottomInfoPanel";
import MapAgeSelector from "./MapAgeSelector";

export const MapContext = React.createContext({});

export default function Map({
  practiceList,
  regionList,
  selectedRegion,
  handleSelect,
}) {
  const sessionToken = getSessionToken();

  const [age, setAge] = useState(25);

  return (
    <Box p={0}>
      <MapContext.Provider value={{ age, setAge }}>
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
          {<MapMarkers practiceList={practiceList} />}
          {regionList && (
            <MapRegions
              regions={regionList}
              selected={selectedRegion}
              handleSelect={handleSelect}
            />
          )}
          {selectedRegion && <MapBottomInfoPanel region={selectedRegion} />}
        </MapContainer>
        {/* {sessionToken && <AdminPanel />} */}
      </MapContext.Provider>
    </Box>
  );
}

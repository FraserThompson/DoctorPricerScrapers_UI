import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";

require("drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js");
require("drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css");

export default function MapMarkers({ practiceList }) {
  const map = useMap();
  const [layer, setLayer] = useState(null);
  const [markers, setMarkers] = useState(null);

  const getMarkerColor = (active) => (active ? "green" : "gray transparent");

  const getMarkerLabel = (price) => {
    if (price == "1000") {
      return "?"
    } else if (price == "999") {
      return "X"
    } else {
      return "$" + price.toFixed(2).replace(".00", "") //probably a better way of doing this lol
    }
  }

  const getMarkerIcon = (practice) => {
    const iconMarkup = ReactDOMServer.renderToString(
      <i className=" fa fa-map-marker-alt fa-3x">{getMarkerLabel(practice.price)}</i>
    );

    return L.divIcon({
      iconSize: [35, 45],
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16],
      className:
        "awesome-marker awesome-marker-icon-" +
        getMarkerColor(practice.active) +
        " leaflet-zoom-animated leaflet-interactive map-icon-practice",
      markerColor: "red",
      iconColor: "white",
      html: iconMarkup,
    });
  };

  const makeMarkers = (list) => {
    const markers = list.map((practice) => {
      const coords = [practice.lat, practice.lng];

      const marker = L.marker(coords, {
        title: practice.name,
        icon: getMarkerIcon(practice),
      });

      const markerContent = ReactDOMServer.renderToString(
        <h5>
          <a href={practice.url} target="_blank">
            {practice.name}
          </a>
          <br />
          {!practice.active ? (
            <>
              <small>
                <strong>Not Enrolling Patients</strong>
              </small>
              <br />
            </>
          ) : (
            <></>
          )}
          <small>Phone: {practice.phone}</small>
          <br />
          <small>{practice.pho}</small>
        </h5>
      );

      marker.bindPopup(markerContent, {
        autoclose: false,
        closeOnClick: false,
        permanent: true,
      });

      return marker;
    });

    return markers;
  };

  // On init
  useEffect(() => {
    // If it's null remove all practices from map
    if (!practiceList) {
      if (layer) map.removeLayer(layer);
      setLayer(null);
      return;
    }

    if (layer) map.removeLayer(layer);

    const markers = makeMarkers(practiceList);
    const markersLayer = L.featureGroup(markers);

    map.addLayer(markersLayer);
    setMarkers(markers);
    setLayer(markersLayer);
  }, [practiceList]);

  return <></>;
}

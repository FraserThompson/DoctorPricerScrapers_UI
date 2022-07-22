import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import MapPopup from "./MapPopup";
import { AppContext } from "../ScraperApp";
import { getPriceByAge } from "../Utils";

require("drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js");
require("drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css");

export default function MapMarkers({
  practiceList,
  selected,
  handleSelectPractice,
}) {
  const map = useMap();

  const context = useContext(AppContext);

  const [layer, setLayer] = useState(null);
  const [markers, setMarkers] = useState(null);

  const getMarkerColor = (active) => (active ? "green" : "gray");

  const getMarkerLabel = (all_prices) => {
    const price = getPriceByAge(all_prices, context.age);
    if (price == "1000") {
      return "?";
    } else if (price == "999") {
      return "X";
    } else {
      return "$" + price.toFixed(2).replace(".00", ""); //probably a better way of doing this lol
    }
  };

  const getMarkerIcon = (practice) => {
    const iconMarkup = ReactDOMServer.renderToString(
      <i className=" fa fa-map-marker-alt fa-3x">
        {getMarkerLabel(practice.all_prices)}
      </i>
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
    const markers = list.map((practice, index) => {
      const coords = [practice.lat, practice.lng];

      const marker = L.marker(coords, {
        title: practice.name,
        icon: getMarkerIcon(practice),
      });

      const markerContent = MapPopup(practice);

      marker.on("click", (e) => handleSelectPractice(index));

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

  // On practice selected
  useEffect(() => {
    selected != undefined && markers[selected].openPopup();
  }, [selected]);

  // On age change
  useEffect(() => {
    markers &&
      markers.forEach((marker, index) => {
        marker.setIcon(getMarkerIcon(practiceList[index]));
      });
  }, [context.age]);

  return <></>;
}

import React, { useContext, useEffect } from "react";
import MapPopup from "./MapPopup";
import { AppContext } from "../ScraperApp";
import { getPriceByAge } from "../Utils";
import { Marker, Popup, useMap } from "react-map-gl";
import MapPin from "./MapPin";

export default function MapMarkers({
  practiceList,
  selected,
  handleSelectPractice,
}) {
  const context = useContext(AppContext);
  const { current: map } = useMap();

  const getMarkerColor = (active) => (active ? "green" : "gray");

  const getMarkerLabel = (all_prices) => {
    const price = getPriceByAge(all_prices, context.age);
    if (price == null || price == undefined) {
      return "?";
    } else if (price == "1000") {
      return "?";
    } else if (price == "999") {
      return "X";
    } else {
      return "$" + price.toFixed(2).replace(".00", ""); //probably a better way of doing this lol
    }
  };

  useEffect(() => {
    if (!selected && selected != 0) {
      return;
    }
    const coords = {
      lat: practiceList[selected].lat,
      lng: practiceList[selected].lng,
    };
    map.flyTo({ center: coords, zoom: 15, duration: 2000 });
  }, [selected]);

  return (
    practiceList && (
      <>
        {practiceList.map((practice, index) => {
          return (
            <Marker
              longitude={practice.lng}
              latitude={practice.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleSelectPractice(index);
              }}
            >
              <MapPin
                size={36}
                label={getMarkerLabel(practice.all_prices)}
                color={getMarkerColor(practice.active)}
              />
            </Marker>
          );
        })}
        {selected && selected != 0 && (
          <Popup
            anchor="top"
            longitude={Number(practiceList[selected].lng)}
            latitude={Number(practiceList[selected].lat)}
            onClose={() => handleSelectPractice(null)}
          >
            <MapPopup practice={practiceList[selected]} />
          </Popup>
        )}
      </>
    )
  );
}

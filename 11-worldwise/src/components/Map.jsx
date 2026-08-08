import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesProvider";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  //receive lat and lng from querystring
  //this one works a lot like useState
  //except we have to then get the values from the variable
  const [mapPosition, setMapPosition] = useState([40, 0]); //43.04, -75.87
  const [urlLat, urlLng] = useUrlPosition();
  //console.log("mapPosition " + urlLat + " " + urlLng);

  const urlPosition = [urlLat, urlLng];

  const { cities } = useCities();

  //for when user clicks to use their own position
  const {
    isLoading: isGeoLoading,
    position: geoPosition,
    getPosition: getGeoPosition,
  } = useGeolocation();

  const geoLat = geoPosition?.lat;
  const geoLng = geoPosition?.lng;

  useEffect(
    function () {
      //console.log("MAP useEffect for URL: " + urlLat + " " + urlLng);
      if (urlLat !== undefined && urlLng !== undefined)
        setMapPosition([urlLat, urlLng]);
    },
    [urlLat, urlLng],
  );

  useEffect(
    function () {
      //console.log("MAP useEffect for geo: " + geoLat + " " + geoLng);
      if (geoLat !== undefined && geoLng !== undefined)
        setMapPosition([geoLat, geoLng]);
    },
    [geoLat, geoLng],
  );

  // console.log(
  //   `urlPosition: ${urlPosition} isArray? ${Array.isArray(urlPosition)}`,
  // );

  // console.log(
  //   `geoPosition: ${geoPosition} isArray? ${Array.isArray(geoPosition)}`,
  // );
  // console.log(
  //   `mapPosition: ${mapPosition} isArray? ${Array.isArray(mapPosition)}`,
  // );

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type="position" handleClick={getGeoPosition}>
          {isGeoLoading ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={3}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {geoPosition && (
          <Marker
            position={[geoPosition.lat, geoPosition.lng]}
            key={Math.random()}
          >
            <Popup>
              <span>Home Sweet Home</span>
            </Popup>
          </Marker>
        )}

        <CenterMap position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

//center the map for a singular point when in querystrin
function CenterMap({ position }) {
  if (position[0] === undefined || position[1] === undefined) {
    console.log("CenterMap func values undefined");
    return null;
  }

  // console.log("setting map center");
  const map = useMap();
  map.setView(position, 3); //lower number = zoom out

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      //console.log(`last form city lat/lng: ${e.latlng}`);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;

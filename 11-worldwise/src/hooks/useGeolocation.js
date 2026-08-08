import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);

  function getPosition() {
    //console.log("getting geolocation");

    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        //console.log(pos);
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    );
  }
  return { isLoading, error, position, getPosition };
}

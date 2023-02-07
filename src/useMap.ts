import { useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { MAPS_API_KEY } from "./config";

export const useMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map>();

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(undefined);
  }, []);

  return {
    isLoaded,
    onLoad,
    onUnmount,
  };
};

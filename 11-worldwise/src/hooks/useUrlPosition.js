import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (lat !== undefined && lng != undefined) {
    //console.log("we have lat lng from URL");
    return [lat, lng];
  }
  //console.log("no lat and lng in URL");
  return [];
}

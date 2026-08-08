import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesProvider";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import styles from "./City.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  //receive city id from URL paramms
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  // const [cityLat, cityLng] = useUrlPosition();
  // console.log("cityPosition " + cityLat + " " + cityLng);

  //const { cityName, emoji, date, notes } = currentCity;
  //console.log("received by CITY:");
  //console.log(currentCity);
  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{currentCity.emoji}</span> {currentCity.cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {currentCity.cityName} on</h6>
        <p>{formatDate(currentCity.date || null)}</p>
      </div>

      {currentCity.notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{currentCity.notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${currentCity.cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {currentCity.cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;

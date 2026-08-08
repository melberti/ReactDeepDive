import { useCities } from "../contexts/CitiesProvider";
import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();

  function handleDelete(e, id) {
    e.preventDefault();
    deleteCity(id);
  }
  //console.log(`currentCity.id: ${currentCity.id} city.id: ${city.id}`);
  return (
    <li>
      <Link
        to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
        className={`${styles.cityItem} ${currentCity?.id === city.id ? styles["cityItem--active"] : ""}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>{formatDate(city.date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => handleDelete(e, city.id)}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;

import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  const countryList = cities.reduce((countries, city) => {
    if (!countries.map((e) => e.country).includes(city.country)) {
      return [...countries, { country: city.country, emoji: city.emoji }];
    } else return countries;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countryList.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;

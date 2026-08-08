import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

function reducer(state, action) {
  //console.log("action.type: " + action.type);
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
        currentCity: {},
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "errored":
      console.log("error: " + action.payload);
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("unexpected action type : " + action.type);
  }
}

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

const BASE_URL = `http://localhost:9000/cities/`;

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  //get all city data
  useEffect(function () {
    //http://localhost:9000/cities
    async function getCities() {
      try {
        dispatch({ type: "loading" });

        const resp = await fetch(`${BASE_URL}`);
        if (!resp.ok) throw new Error("Could not fetch data for all cities");

        const data = await resp.json();

        //console.log(data);

        dispatch({ type: "cities/loaded", payload: data });

        //console.log("city data set");
      } catch (error) {
        dispatch({
          type: "errored",
          payload: "Error loading cities data: " + error.message,
        });
      }
    }
    getCities();
  }, []);

  //because this does not need to load EVERY time component mounts
  //it need not be called in an effect
  //needs to be passed as part of context value
  //memo-ize to make it stable so we don't get an endless loop
  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === Number(id)) return;

      try {
        dispatch({ type: "loading" });
        const resp = await fetch(`${BASE_URL}/${id}`);
        if (!resp.ok) throw new Error(`Could not fetch data for city id ${id}`);
        const data = await resp.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "errored",
          payload: "Error loading city data: " + error.message,
        });
      }
    },
    [currentCity.id],
  );

  async function createCity(city) {
    try {
      dispatch({ type: "loading" });
      const resp = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) throw new Error(`Could not post data for new city`);
      const data = await resp.json();
      //console.log(data);

      dispatch({ type: "city/created", payload: data });
      //setCities((cities) => [...cities, data]); //add new POSTED city to the state
    } catch (error) {
      dispatch({
        type: "errored",
        payload: "Error posting city data: " + error.message,
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      //no data is returned by a delete statement
      //so we need to remove it from state manually
      dispatch({
        type: "city/deleted",
        payload: id,
      });
      //setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      dispatch({
        type: "errored",
        payload: "Error deleting city: " + error.message,
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const ctx = useContext(CitiesContext);
  if (ctx === undefined)
    throw new Error("CitiesContext accessed outside of Provider");
  return ctx;
}

export { CitiesProvider, useCities };

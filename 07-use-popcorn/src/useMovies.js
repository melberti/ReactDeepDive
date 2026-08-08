import { useEffect } from "react";
import { useState } from "react";

export function useMovies(query, callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  const myKey = "19e7d905";

  useEffect(
    function () {
      //call callback function ahead of anything else
      //but only if it exists - check with optional chaining
      //close any moview details previously open
      callback?.(null); //this callback is setSelectedMovieId

      const controller = new AbortController();

      async function getMovies() {
        try {
          setIsLoading(true);
          setError(""); //clear out any prior errors

          //set a short pause so we see the LOADING messge
          //await new Promise((resolve) => setTimeout(resolve, 500));

          const resp = await fetch(
            `http://www.omdbapi.com/?apikey=${myKey}&s=${query}`,
            { signal: controller.signal },
          );

          if (!resp.ok) {
            throw new Error("Something went wrong");
          }

          const data = await resp.json();
          //console.log(data);

          if (data.Error) throw new Error(data.Error);

          //console.log("async method called");
          //console.log(data.Search);

          setMovies(data.Search);
        } catch (err) {
          //console.log("error name: " + err.name);

          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      //if there's nothing to query, don't
      if (!query || query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      getMovies(); //now call the function

      //cleanup function
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  //need to return movies, isLoading and error state values
  return { movies, isLoading, error };
}

import { useEffect, useRef, useState } from "react";
import StarRater from "./components/StarRater.js";
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";
import { useKey } from "./useKey.js";

const myKey = "19e7d905";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  //const [watched, setWatched] = useState([]);

  const { movies, isLoading, error } = useMovies(query, setSelectedMovieId);

  //this is using a hook but will be defined just like a state variable
  //need to pass in original state (empty array)
  const [watched, setWatched] = useLocalStorageState([], "watchedMovies");

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  //this logs the values... not sure how!
  //const test = watched.map((mov) => mov.imdbID);

  //console.log(watched);

  //console.log("selectedID: " + selectedMovieId);
  //watched.map((w) => console.log(w.imdbID));

  //console.log("selected movie was watched? " + selectedMovieWasWatched);

  function handleMovieSelect(id) {
    //dump the selection if re-selecting
    //make sure we have latest state by using callback function
    setSelectedMovieId((selectedId) => (selectedId === id ? null : id));

    //console.log(`Movie ID ${id} selected`);
  }

  function handleAddWatched(watchedMovie) {
    //console.log("user rating: " + watchedMovie.userRating);

    //if rating not provided, do not add movie
    if (!watched.some((w) => w.imdbID === watchedMovie.imdbID)) {
      //add new movie

      setWatched((watched) => [...watched, watchedMovie]);
    } else {
      //update the movie in the list
      const updatedWatched = watched.map((movie) =>
        movie.imdbID === watchedMovie.imdbID
          ? { ...movie, userRating: watchedMovie.userRating }
          : movie,
      );

      setWatched(updatedWatched);
    }
  }

  function handleWatchedDelete(id) {
    setWatched((w) => w.filter((a) => a.imdbID !== id));
  }

  //in this form, this function will fire after render phase
  //and after component is painted to the screen
  //it happens automatically
  //empty [] dependency array says on mount only
  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${myKey}&s=${"The Proposal"}`).then(
  //     (resp) => resp.json().then((data) => setMovies(data.Search)),
  //   );
  //   console.log("on mount function called");
  //   console.log(movies);
  // }, []);

  //to register same function to run asynchronously
  //must create a function inside the useEffect function
  //and call that function by name

  return (
    <>
      <NavBar>
        {/* rather than pass movies as a prop to navbar, we can pass the nested components as children to navbar */}
        <Logo logoText="usePopcorn" emoji="🍿" />
        <SearchBar query={query} onSetQuery={setQuery} />
        <SearchResultsCount count={movies ? movies.length : 0} />
      </NavBar>
      <Main>
        {/* and same here... we can pass the nested components as children to MovieBox */}
        <ToggleBox>
          {isLoading ? (
            <Loader></Loader>
          ) : error !== "" ? (
            <ErrorMessage message={error}></ErrorMessage>
          ) : (
            <MovieList movies={movies} onSelectMovie={handleMovieSelect} />
          )}
        </ToggleBox>
        {/* alternate to passing chilren is to pass element 
            would then reference {element} in the ToggleBox component, instead of {children}
            <ToggleBox element={<MovieList movies={movies} />} />
            like so */}

        <ToggleBox>
          {selectedMovieId && (
            <MovieDetails
              selectedMovieId={selectedMovieId}
              onCloseMovie={() => setSelectedMovieId(null)}
              onAddWatched={handleAddWatched}
              watchedMovies={watched}
            />
          )}
          {!selectedMovieId && (
            <>
              <WatchedSummary
                watched={watched}
                avgImdbRating={avgImdbRating}
                avgUserRating={avgUserRating}
                avgRuntime={avgRuntime}
              />

              <WatchedList
                watchedList={watched}
                onWatchedDelete={handleWatchedDelete}
              />
            </>
          )}
        </ToggleBox>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message} 🛑</p>;
}

function WatchedSummary({ watched, avgImdbRating, avgUserRating, avgRuntime }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {isNaN(avgRuntime) ? "N/A" : avgRuntime.toFixed(0) + " min"}
          </span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watchedList, onWatchedDelete }) {
  return (
    <ul className="list">
      {watchedList.map((movie) => (
        <WatchedItem
          movie={movie}
          key={movie.imdbID}
          onWatchedDelete={() => onWatchedDelete(movie.imdbID)}
        />
      ))}
    </ul>
  );
}

function WatchedItem({ movie, onWatchedDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{isNaN(movie.runtime) ? "N/A" : movie.runtime + " min"}</span>
        </p>
        <button onClick={onWatchedDelete}>❌</button>
      </div>
    </li>
  );
}

function ToggleBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && <>{children}</>}
    </div>
  );
}

function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const countRef = useRef(0);

  useEffect(
    function () {
      //because effect will run on mount, when rating is empty string
      //we want to be sure there is a value before executing the match
      //note that the ref variable need not be passed in dependency array
      //note that a regular JS variable would revert to 0 with each re-render and not persist value
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating],
  ); //every time userRating is updated, update the countRef

  const wasWatched = watchedMovies
    .map((m) => m.imdbID)
    .includes(selectedMovieId);

  function handleAddClick() {
    //console.log("runtime: " + Number(movie.Runtime.split(" ").at(0)));

    const newWatchedMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: Number(movie.Year),
      Poster: movie.Poster,
      runtime: Number(movie.Runtime.split(" ").at(0)),
      imdbRating: Number(movie.imdbRating),
      userRating: Number(userRating),
      countRatingDecisions: Number(countRef.current),
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovie() {
        try {
          setIsLoading(true);
          //console.log("in getMovie: " + selectedMovieId);
          const resp = await fetch(
            `http://www.omdbapi.com/?apikey=${myKey}&i=${selectedMovieId}`,
            { signal: controller.signal },
          );

          if (!resp.ok) {
            console.log("not okay");
            throw new Error("Something went wrong; could not get movie");
          }

          const data = await resp.json();

          if (data.Error) {
            console.log("data error");
            throw new Error(data.Error);
          }

          //console.log("view movie");
          //console.log(data.Runtime);

          setMovie(data);
        } catch (err) {
          //TODO: error = err.message;
          if (err.name !== "AbortError") console.log(err.message);
          //console.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      //console.log("selectedId: " + selectedMovieId);

      //if there's nothing to query, don't
      if (!selectedMovieId || selectedMovieId.length < 3) {
        setMovie([]);
        //TODO: setError("");
        return;
      }
      getMovie();

      //cleanup function
      return function () {
        controller.abort();
      };
    },
    [selectedMovieId],
  );

  useEffect(
    function () {
      if (movie) document.title = `MOVIE | ${movie.Title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie],
  );

  useKey("Escape", onCloseMovie);

  //finally, the view itself
  if (isLoading) {
    return <Loader></Loader>;
  } else if (movie === null) {
    return <p>Movie is null</p>;
  } else {
    return (
      <div className="details">
        <header>
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <img src={movie.Poster} alt={movie.Title} />
          <div className="details-overview">
            <h2>{movie.Title}</h2>
            {movie.Released} - {movie.Runtime}
            <p>{movie.Genre}</p>
            <p>
              <span style={{ color: "yellow" }}>★</span> {movie.imdbRating}
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            {wasWatched ? (
              <p style={{ textAlign: "center" }}>
                You rated this movie{" "}
                {
                  watchedMovies.find((m) => m.imdbID === selectedMovieId)
                    ?.userRating
                }
                {" ⭐"}
              </p>
            ) : (
              <>
                <StarRater
                  maxStars={10}
                  sizePixels={18}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={() => handleAddClick()}>
                    Add to Watched List
                  </button>
                )}
              </>
            )}
          </div>

          <p className="details">{movie.Plot}</p>
          <p>Starring {movie.Actors}</p>
          <p>Directed by {movie.Director}</p>
        </section>
      </div>
    );
  }
}

function SearchResultsCount({ count }) {
  return (
    <p className="num-results">
      Found <strong>{count}</strong> results
    </p>
  );
}

function SearchBar({ query, onSetQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    //we can even clear the existing search
    onSetQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <div className="box">
      {!movies || movies.length === 0 ? (
        <p className="error">No search criteria provided</p>
      ) : (
        <ul className="list list-movies">
          {movies?.map((movie) => (
            <MovieItem
              movie={movie}
              key={movie.imdbID}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function MovieItem({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Main({ children }) {
  //rather than accept {movies} as prop
  //and include MovieBox component
  //we can accept {children} which itself consists of MovieBox
  return <main className="main">{children}</main>;
}

function Logo({ logoText, emoji }) {
  return (
    <div className="logo">
      <span role="img">{emoji}</span>
      <h1>{logoText}</h1>
    </div>
  );
}

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

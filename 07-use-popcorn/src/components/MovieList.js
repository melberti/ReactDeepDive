import MovieItem from "./MovieItem";

export default function MovieList({ movies, onSelectMovie }) {
  return (
    <div className="box">
      {!movies || movies.length === 0 ? (
        <p className="error">No search criteria provided</p>
      ) : (
        <ul className="list">
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

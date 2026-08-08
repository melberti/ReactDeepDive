import WatchedItem from "./WatchedItem";

export default function WatchedList({ watchedList }) {
  return (
    <ul className="list">
      {watchedList.map((movie) => (
        <WatchedItem movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

export default function SearchResultsCount({ count }) {
  return (
    <p className="num-results">
      Found <strong>{count}</strong> results
    </p>
  );
}

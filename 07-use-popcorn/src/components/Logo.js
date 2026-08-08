export default function Logo({ logoText, emoji }) {
  return (
    <div className="logo">
      <span role="img">{emoji}</span>
      <h1>{logoText}</h1>
    </div>
  );
}

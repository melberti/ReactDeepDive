export default function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        Start adding items to your packing list.
      </footer>
    );

  const numItems = items.length;
  const packedCount = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedCount / items.length) * 100);

  return (
    <footer className="stats">
      {percentage === 100
        ? "You got everything! Ready to go! ✈️"
        : `📋You have ${numItems} item${items.length > 1 ? "s" : ""} on your list,
      and you already packed ${packedCount} (${percentage}%).`}
    </footer>
  );
}

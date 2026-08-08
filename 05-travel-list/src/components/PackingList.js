import { useState } from "react";
import Item from "./Item";

export default function PackingList({
  items,
  onDeleteItem,
  onTogglePacked,
  onReset,
}) {
  //using state for the sortby because we want to re-render the list any time that value changes
  //state also maintains the selected value
  const [sortBy, setSortBy] = useState("input");

  //used derived state: create new array based on state array of items
  //sorted as needed
  let sortedItems;
  if (sortBy === "description")
    sortedItems = items.slice().sort((a, b) => a.description > b.description);
  if (sortBy === "status")
    sortedItems = items.slice().sort((a, b) => a.packed < b.packed);
  if (sortBy === "input") sortedItems = items;

  console.log(sortedItems);

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onTogglePacked={onTogglePacked}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by descriptions</option>
          <option value="status">Sort by packed status</option>
        </select>
        <button onClick={onReset}>Clear List</button>
      </div>
    </div>
  );
}

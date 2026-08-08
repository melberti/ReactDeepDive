export default function Item({ item, onDeleteItem, onTogglePacked }) {
  return (
    <li className="list">
      <input
        type="checkbox"
        value={item.packed}
        onChange={(e) => onTogglePacked(item.id)}
        style={{ display: "inline" }}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
        <button onClick={(e) => onDeleteItem(item.id)}>❌</button>
      </span>
    </li>
  );
}

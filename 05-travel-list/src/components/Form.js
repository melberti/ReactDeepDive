import { useState } from "react";

export default function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    //guard clause; don't let empty item be submitted
    if (!description) return;

    //description and quantity below are now coming from state
    //id is a random value, always unique
    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);

    //save item
    //initialItems = { ...initialItems, newitem };
    onAddItem(newItem);

    //reset form
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?💭</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>

      <button>Add</button>
    </form>
  );
}

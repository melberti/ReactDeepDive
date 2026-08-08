import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import AdjustItemQuantity from "../cart/AdjustItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  const countItemInCart = useSelector(getQuantityById(id));
  const itemInCart = countItemInCart > 0;

  //console.log(`item ${id} in cart: ${itemInCart}`);

  const dispatch = useDispatch();

  function handleAddItem() {
    const newItem = {
      pizzaId: id,
      name,
      unitPrice,
      quantity: 1,
      totalPrice: unitPrice,
    };

    dispatch(addItem(newItem));
  }

  return (
    <li className={`flex gap-4 py-2 ${soldOut ? "opacity-60 grayscale" : ""}`}>
      <img src={imageUrl} alt={name} className="h-24" />
      <div className="flex grow flex-col">
        <p className="font-medium">{name}</p>
        <p className="text-sm italic text-stone-500">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-400">
              Sold out
            </p>
          )}

          <div className="flex place-items-end">
            {itemInCart && (
              <>
                <AdjustItemQuantity pizzaId={id} />
                <DeleteItem pizzaId={id} />
              </>
            )}
            {!soldOut && !itemInCart && (
              <Button type="small" onClick={handleAddItem}>
                Add to cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;

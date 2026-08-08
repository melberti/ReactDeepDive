import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import {
  increaseItemQuantity,
  decreaseItemQuantity,
  getQuantityById,
} from "./cartSlice";

function AdjustItemQuantity({ pizzaId }) {
  const dispatch = useDispatch();
  const itemQuantity = useSelector(getQuantityById(pizzaId));

  return (
    <div className="mr-5 flex items-center gap-2 md:gap-3">
      <Button
        type="small"
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
      <span>{itemQuantity}</span>
      <Button
        type="small"
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>
    </div>
  );
}

export default AdjustItemQuantity;

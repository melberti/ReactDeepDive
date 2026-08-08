import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCartTotalPrice, getCartTotalQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const pizzaCount = useSelector(getCartTotalQuantity);
  //console.log(`cartoverview.jsx pizzaCount: ${pizzaCount}`);

  const totalPrice = useSelector(getCartTotalPrice);

  if (pizzaCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-stone-700 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 sm:py-6 md:text-base">
      <p className="space-x-3 font-semibold text-stone-400">
        <span>{pizzaCount} pizzas</span>
        <span>{formatCurrency(totalPrice)}</span>
      </p>

      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;

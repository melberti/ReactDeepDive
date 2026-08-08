import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import LinkButton from "../../ui/LinkButton";
import CartItem from "./CartItem";
import { clearCart, getCart } from "./cartSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUsername } from "../user/userSlice";
import EmptyCart from "./EmptyCart";

function Cart() {
  const cart = useSelector(getCart);

  const username = useSelector(getUsername);
  console.log(`cart.jsx username:${username}.`);

  const dispatch = useDispatch();

  // const navigate = useNavigate();
  // if (username === "") {
  //   console.log("cart.jsx go home b/c username is empty");
  //   navigate("/");
  // }

  // useEffect(
  //   function () {
  //     if (!username) {
  //       console.log("cart.jsx go home b/c username is empty");
  //       navigate("/");
  //     }
  //   },
  //   [username, navigate],
  // );

  const pizzaCount = (cart && cart.length) || 0;
  //console.log(`cart.jsx pizza count: ${pizzaCount}`);

  if (pizzaCount === 0) return <EmptyCart />;

  function handleClearCart() {
    dispatch(clearCart());
  }

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">
        {`Your cart${pizzaCount === 0 ? " is empty" : ""}, ${username}`}
      </h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((p) => (
          <CartItem item={p} key={p.pizzaId} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Order pizzas
        </Button>
        <Button type="secondary" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;

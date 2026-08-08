import LinkButton from "../../ui/LinkButton";
import { getUsername } from "../user/userSlice";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

function EmptyCart() {
  // const username = getUsername();

  // const navigate = useNavigate();

  // console.log(`emptycart un: ${username}`);
  // if (username === "") {
  //   console.log("cart.jsx go home b/c username is empty");
  //   navigate("/");
  // }

  return (
    <div>
      <>
        {" "}
        <LinkButton to="/menu">&larr; Back to menu</LinkButton>
        <p className="mx-auto mt-6 text-center font-semibold">
          Your cart is empty; add some pizzas
        </p>
      </>
    </div>
  );
}

export default EmptyCart;

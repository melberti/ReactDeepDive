import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { getUsername, fetchAddress } from "../user/userSlice";
import { clearCart, getCart, getCartTotalPrice } from "../cart/cartSlice";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../cart/EmptyCart";
import { redirect } from "react-router-dom";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getCartTotalPrice);

  const priorityPrice = totalCartPrice * 0.2;
  //append priority fee if required
  const totalPrice = totalCartPrice + (withPriority ? priorityPrice : 0);

  const {
    username,
    position,
    address,
    status: geolocationStatus,
    error: geolocationError,
  } = useSelector((state) => state.user);

  // const navigate = useNavigate();
  // if (username === "") {
  //   console.log("createorder.jsx go home b/c username is empty");
  //   navigate("/");
  // }
  //console.log(position.latitude, position.longitude, address, geolocationError);

  const isLoadingAddress = geolocationStatus === "loading";
  //console.log(cart);

  const formErrors = useActionData();

  //console.log(`totalPrice: ${totalCartPrice}`);

  if (!cart.length) return <EmptyCart />;

  async function handleGeolocationClick(e) {
    e.preventDefault();

    await dispatch(fetchAddress());
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
      {/* 
Could also have written it this way but action is not required;
ReactRouter will automatically match to the closest route for this component in createBrowserRouter
<Form method='POST' action="/order/new"></Form> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            placeholder="First Name"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">Phone number</label>
          <div className="grow">
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone"
              className="input w-full"
            />
            {formErrors?.phone && (
              <p className="mt-2 px-2 text-[13px] text-red-700">
                {formErrors?.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 align-top sm:flex-row sm:items-center">
          <label className="mb-auto sm:basis-32">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              placeholder="Address"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {geolocationStatus && (
              <p className="mt-2 px-2 text-[13px] text-red-700">
                {geolocationError}
              </p>
            )}
          </div>
          {(!position.latitude === undefined || !position.latitude) && (
            <span className="mb-auto">
              <Button
                type="small"
                onClick={(e) => handleGeolocationClick(e)}
                disabled={isLoadingAddress}
              >
                Get Geolocation
              </Button>
            </span>
          )}
        </div>

        <div className="mb-10 flex items-center gap-2">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="mb-3 mr-2 h-5 w-5 align-baseline accent-yellow-200"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="mb-3 font-semibold">
            Want to give your order priority? (add{" "}
            {formatCurrency(priorityPrice)})
          </label>
        </div>

        <input type="hidden" name="cart" value={JSON.stringify(cart)} />

        <input
          type="hidden"
          name="position"
          value={
            position.longitude
              ? `${position.latitude},${position.longitude}`
              : ""
          }
        />

        <div>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing Order..."
              : `Order now ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  //console.log("formData:");
  //console.log(formData);
  //console.log("data:");
  //console.log(data.position);

  //cart was changed from object to string in the hidden field above
  //so must be converted back to an object before adding to order
  //note the use of data here, NOT request, to get the cart value
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  //data validation error handling
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Provide a valid phone number";
  }
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //route user to view the order
  //we can't use useNavigate hook here because we are not in a component
  //use redirect function provided by React Router

  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;

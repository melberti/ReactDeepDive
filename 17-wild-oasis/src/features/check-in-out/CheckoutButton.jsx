import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

function CheckoutButton({ bookingId }) {
  const { checkout, isUpdating } = useCheckout();
  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isUpdating}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;

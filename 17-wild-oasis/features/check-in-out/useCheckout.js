import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";

export function useCheckout() {
  //const { bookingId } = useParams(); //may or may not be there
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isUpdating, mutate: checkout } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, { status: "checked-out" }),
    onError: (err) => toast.error(err.message),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} checked out successfully`);
      queryClient.invalidateQueries({ active: true }); //will invalidate ALL queries in the hook
    },
  });

  return { isUpdating, checkout };
}

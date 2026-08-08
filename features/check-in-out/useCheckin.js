import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate, useParams } from "react-router-dom";

export function useCheckin() {
  const { bookingId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isUpdating, mutate: checkin } = useMutation({
    //mutation function can only accept 1 argument, so make that arg an object
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onError: (err) => toast.error(err.message),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} checked in successfully`);
      queryClient.invalidateQueries(["booking", bookingId]);

      //jonas had us go back to dashboard; i think it makes more sense to go back to booking or bookings
      //navigate("/");
      navigate(`/booking/${bookingId}`);
    },
  });

  return { isUpdating, checkin };
}

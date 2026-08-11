import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useUpdateBooking(id, object) {
  const queryClient = useQueryClient();
  const {
    isLoading: isUpdating,
    error,
    data: bookings,
  } = useMutation({
    mutationFn: (id, object) => updateBooking(id, object),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, error, bookings };
}

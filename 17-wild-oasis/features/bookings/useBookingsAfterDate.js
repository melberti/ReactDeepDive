import { useQuery } from "@tanstack/react-query";
import { getBookingsAfterDate } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useBookingsAfterDate(date) {
  const {
    isLoading,
    error,
    data: bookings,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: (date) => getBookingsAfterDate(date),
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, error, bookings };
}

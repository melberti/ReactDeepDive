import { useQuery } from "@tanstack/react-query";
import { getStaysAfterDate } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useStaysAfterDate(date) {
  const {
    isLoading,
    error,
    data: bookings,
  } = useQuery({
    queryFn: (date) => getStaysAfterDate(date),
    queryKey: ["bookings"],
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, error, bookings };
}

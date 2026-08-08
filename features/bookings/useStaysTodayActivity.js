import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useStaysTodayActivity() {
  const {
    isLoading,
    error,
    data: bookings,
  } = useQuery({
    queryFn: getStaysTodayActivity,
    querykey: ["bookings"],
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, error, bookings };
}

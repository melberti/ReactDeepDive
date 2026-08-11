import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getBookingsAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";

export function useBookingsAfterDate() {
  const [searchParams] = useSearchParams();

  //default to 7 days if not found in querystring
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["bookings", `last-${numDays}`], //numDays sort of like a dependency array, makes the stays table unique from any other with diff
    onError: (err) => toast.error(err.message),
  });

  return { bookings, isLoading, error };
}

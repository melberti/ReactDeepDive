import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";

export function useStaysAfterDate() {
  const [searchParams] = useSearchParams();
  //default to 7 days if not found in querystring

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  const queryDate = subDays(new Date(), numDays).toISOString();

  const {
    data: stays,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ["stays", `last-${numDays}`], //numDays sort of like a dependency array, makes the stays table unique from any other with diff value
    onError: (err) => toast.error(err.message),
  });

  const confirmedStays = stays?.filter(
    (s) => s.status === "checked-in" || s.status === "checked-out",
  );

  return { stays, confirmedStays, isLoading, error };
}

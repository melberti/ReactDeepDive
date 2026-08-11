import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getStaysTodayActivity } from "../../services/apiBookings";

export function useStaysTodaysActivity() {
  const {
    data: stays,
    error,
    isLoading,
  } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["today-activity"],
    onError: (err) => toast.error(err.message),
  });

  return { stays, isLoading };
}

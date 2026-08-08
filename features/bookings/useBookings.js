import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const [searchParams] = useSearchParams();

  //filter
  const filterValue = searchParams.get("status");
  const filter = !filterValue
    ? null
    : { field: "status", value: filterValue, method: "eq" }; //see use of method in api

  //sort
  const sortBy = searchParams.get("sortBy") || "startDate-desc";
  const [sortCol, sortDir] = sortBy.split("-");
  const sort = { sortCol: sortCol, sortDir: sortDir };

  //pagination
  const curPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const {
    isLoading,
    error,
    data: { data: bookings, count } = {},
  } = useQuery({
    queryFn: () => getBookings(filter, sort, curPage),
    queryKey: ["bookings", filter, sort, curPage],
    onError: (err) => toast.error(err.message),
  });

  //prefetch data so we don't have to wait
  //but only if not on the last page already
  const pageCount = Math.ceil(count / PAGE_SIZE);
  const queryClient = useQueryClient(); //have to define outside of the logic b/c its a hook

  //fetch next page
  if (curPage < pageCount) {
    queryClient.prefetchQuery({
      queryFn: () => getBookings(filter, sort, curPage + 1),
      queryKey: ["bookings", filter, sort, curPage + 1],
    });
  }
  //previous page
  if (curPage > 1) {
    queryClient.prefetchQuery({
      queryFn: () => getBookings(filter, sort, curPage - 1),
      queryKey: ["bookings", filter, sort, curPage - 1],
    });
  }

  return { isLoading, error, bookings, count };
}

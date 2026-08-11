import styled from "styled-components";
import { useBookingsAfterDate } from "./useBookingsAfterDate";
import { useStaysAfterDate } from "./useStaysAfterDate";
import { useCabins } from "../cabins/useCabins";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import Statistics from "./Statistics";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const {
    bookings,
    isLoading: isLoadingBookings,
    error: errorBookings,
  } = useBookingsAfterDate();

  const {
    stays,
    confirmedStays,
    isLoading: isLoadingStays,
    error: errorStays,
  } = useStaysAfterDate();

  const {
    cabins,
    error: errorCabins,
    isLoading: isLoadingCabins,
  } = useCabins();

  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last") ? 30 : searchParams.get("last");

  if (isLoadingBookings || isLoadingStays || isLoadingCabins)
    return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Statistics
        bookings={bookings}
        confirmedStays={confirmedStays}
        cabins={cabins}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart
        bookings={bookings}
        numDays={numDays}
      />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;

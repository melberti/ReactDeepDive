import { useSearchParams } from "react-router-dom";
import Stat from "./Stat";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";

function Statistics({ bookings, confirmedStays, cabins }) {
  //1. number of bookings
  const numBookings = bookings?.length;

  //2. total sales
  const totalSales = bookings.reduce(
    (accum, current) => accum + current.totalPrice,
    0,
  );

  //3. check-ins
  const numConfirmedStays = confirmedStays?.length;

  //4. occupancy rate
  //number of checked in nights / all available nights
  const [searchParams] = useSearchParams();
  //default to 7 days if not found in querystring
  const totalNights = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  const availableNights = totalNights * cabins?.length;
  const occupancy = confirmedStays.reduce(
    (accum, cur) => accum + cur.numNights,
    0,
  );

  const occupancyRate = (occupancy / availableNights) * 100;

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title="Bookings"
        value={numBookings}
        color="blue"
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Sales"
        value={formatCurrency(totalSales)}
        color="green"
      ></Stat>
      <Stat
        icon={<HiOutlineCalendarDays />}
        title="Check-Ins"
        value={confirmedStays.length}
        color="indigo"
      ></Stat>
      <Stat
        icon={<HiOutlineChartBar />}
        title="Occupancy Rate"
        value={`${Math.round(occupancyRate)}%`}
        color="yellow"
      ></Stat>
    </>
  );
}

export default Statistics;

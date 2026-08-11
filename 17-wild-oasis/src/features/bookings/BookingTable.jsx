import Menus from "../../ui/Menus";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import BookingRow from "./BookingRow";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";

function BookingTable() {
  //format: Mon Jun 08 2026 16:47:57 GMT-0400 (Eastern Daylight Time)
  //format at supabase: //01 Jul 2026 17:20:10 (+0000) format at Supabase (TZ)

  //add filter in useBookings method so that wherever that might be called, the hook pulls the querystring value
  //keep it flexible!

  const { isLoading, error, bookings, count } = useBookings();

  if (isLoading) return <Spinner />;

  if (!bookings.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
            />
          )}
        />
        <Table.Footer>
          <Pagination recordCount={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;

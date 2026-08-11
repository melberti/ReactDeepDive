import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return { data, error }; //data is now not just the recordset but also the error and isLoading property
}

//filter is an object that defines both a field and value to filter on
export async function getBookings(filter, sort, curPage) {
  let query = supabase
    .from("bookings")
    .select("*, cabins( name ), guests( fullName, email )", { count: "exact" });

  //add conditions
  //filter
  if (filter !== null && filter.value !== "all") {
    //hardcoded EQ
    query = query.eq(filter.field, filter.value);

    //using dynamic method/operator as well
    //query = query[filter.method || "eq"](filter.field, filter.value);
  }

  //sort
  query = query.order(sort.sortCol || "startDate", {
    ascending: sort.sortDir === "asc",
  });

  //pagination

  if (curPage) {
    const from = (curPage - 1) * PAGE_SIZE;
    const to = curPage * PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Error retrieving bookings");
  }

  return { data, count };
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
//date must be ISO string
//this method is concerned with CREATE date (sales)
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
//this method looks at start date (current stay/occupied room)
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

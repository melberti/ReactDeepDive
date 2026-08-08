import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { useSettings } from "../settings/useSettings";
import { getBookings } from "../../services/apiBookings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const { booking, isLoading: isLoadingBooking } = useBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  useEffect(
    function () {
      if (!isLoadingBooking && !isLoadingSettings) {
        setConfirmPaid(booking?.data?.isPaid || false);
        setAddBreakfast(booking?.data?.hasBreakfast || false);
      }
    },
    [isLoadingBooking, isLoadingSettings, booking?.data],
  );

  const { isUpdating, checkin } = useCheckin();

  if (isLoadingBooking || isLoadingSettings || isUpdating) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking?.data;

  //this doesn't necessarily need to be state;
  //we can use the addBreakfast state to know whether to update this property of the booking
  const optionalBreakfastPrice =
    numGuests * numNights * settings.breakfastPrice;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: booking?.data?.totalPrice + optionalBreakfastPrice,
        },
      });
    } else checkin({ bookingId, breakfast: {} });
  }

  function handleAddBreakfast() {
    //state before the setter will be the old state; if currently turned off and now turning on, set paid to false
    //also, set the extras Price
    if (!addBreakfast) {
      setConfirmPaid(false);
    }
    setAddBreakfast((add) => !add);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking.data} />

      {!booking?.data?.hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={handleAddBreakfast}
            disabled={addBreakfast || isUpdating}
            id="breakfast"
          >
            Add breakfast for {booking.data.numGuests}{" "}
            {booking.data.numGuests === 1 ? "person" : "people"} for{" "}
            {booking.data.numNights} morning{booking.data.numNights > 1 && "s"}{" "}
            at a cost of {formatCurrency(optionalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirmPaid) => !confirmPaid)}
          disabled={confirmPaid || isUpdating}
          id="paid"
        >
          {!confirmPaid && "I confirm that "}
          {guests.fullName} has paid the total amount of{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(totalPrice + optionalBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)} breakfast)`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          disabled={!confirmPaid || isUpdating}
        >
          Check in booking #{bookingId}
        </Button>

        <Button
          variation="secondary"
          onClick={moveBack}
        >
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import ButtonText from "../../ui/ButtonText";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import BookingDataBox from "./BookingDataBox";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "../bookings/useDeleteBooking";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { isUpdating, checkout } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();

  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  const { status, id: bookingId } = booking.data;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking.data} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <>
            <Button
              variation="primary"
              onClick={() => navigate(`/checkin/${bookingId}`)}
              disabled={isUpdating}
            >
              Check-In
            </Button>

            <Modal>
              <Modal.Open opens="confirm-delete">
                <Button variation="danger">Delete</Button>
              </Modal.Open>

              {/* delete function on booking page differs slightly from that on booking row in that
the page is no longer accessible after the delete; therefore add an onSuccess handler to the page only
which navigates user back to bookings listing */}
              <Modal.Window name="confirm-delete">
                <ConfirmDelete
                  resource="booking"
                  onConfirm={() =>
                    deleteBooking(bookingId, {
                      onSuccess: navigate("/bookings"),
                    })
                  }
                  disabled={isDeleting}
                />
              </Modal.Window>
            </Modal>
          </>
        )}
        {status === "checked-in" && (
          <Button
            variation="primary"
            onClick={() => {
              checkout(bookingId);
            }}
          >
            Check-Out
          </Button>
        )}

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

export default BookingDetail;

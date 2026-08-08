import { toast } from "react-hot-toast";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiHome,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "../bookings/useDeleteBooking";
import { format, isToday } from "date-fns";
import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Button from "../../ui/Button";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const navigate = useNavigate();
  const { isUpdating, checkout } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <Table.Row>
      <Cabin>
        bookId: {bookingId} - {cabinName}
      </Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={bookingId} />
            <Menus.List id={bookingId}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/booking/${bookingId}`)}
              >
                View booking
              </Menus.Button>
              {status === "unconfirmed" && (
                <>
                  <Modal.Open opens="confirm-delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                  </Modal.Open>
                  <Menus.Button
                    icon={<HiArrowDownOnSquare />}
                    onClick={() => navigate(`/checkin/${bookingId}`)}
                  >
                    Check-In
                  </Menus.Button>
                </>
              )}

              {status === "checked-in" && (
                <Menus.Button
                  icon={<HiArrowUpOnSquare />}
                  onClick={() => {
                    checkout(bookingId);
                  }}
                  disabled={isUpdating}
                >
                  Check-Out
                </Menus.Button>
              )}
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="confirm-delete">
            <ConfirmDelete
              resource="booking"
              onConfirm={() => deleteBooking(bookingId)}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default BookingRow;

import { useNavigate } from "react-router-dom";
import { HiSquare2Stack, HiTrash, HiPencil } from "react-icons/hi2";
import styled from "styled-components";
import Button from "../../ui/Button";
import ConfirmDelete from "../../ui/ConfirmDelete";
import ConfirmDuplicate from "../../ui/ConfirmDuplicate";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";
import EditCabin from "./EditCabin";
import { useCreateCabin } from "./useCreateCabin";
import { useDeleteCabin } from "./useDeleteCabin";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  font-size: 7px;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const navigate = useNavigate();

  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();

  const {
    name,
    description,
    maxCapacity,
    regularPrice,
    discount,
    image,
    id: cabinId,
  } = cabin;

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity: maxCapacity,
      regularPrice: regularPrice,
      discount: discount,
      image: image,
      description: description,
    });

    navigate("/cabins");
  }

  const isWorking = isDeleting || isCreating;

  return (
    <>
      <Table.Row>
        <Img
          src={image}
          alt={description}
        />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>

        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>{discount > 0 ? formatCurrency(discount) : "—"}</Discount>
        <div>
          <Button
            size="small"
            variation="primary"
            disabled={isWorking}
            onClick={handleDuplicate}
          >
            <HiSquare2Stack title="Duplicate" />
          </Button>

          <EditCabin
            isWorking={isWorking}
            cabinToEdit={cabin}
          />

          <Modal>
            {/* button or other content that controls the open state */}
            <Modal.Open opens="confirm-delete">
              <Button
                size="small"
                variation="danger"
              >
                <HiTrash title="Delete" />
              </Button>
            </Modal.Open>
            {/* content */}
            <Modal.Window name="confirm-delete">
              <ConfirmDelete
                resource="cabin"
                onConfirm={() => deleteCabin(cabinId)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default CabinRow;

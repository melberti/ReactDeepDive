import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import styled from "styled-components";
import ConfirmDelete from "../../ui/ConfirmDelete";
import ConfirmDuplicate from "../../ui/ConfirmDuplicate";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "../cabins/CreateCabinForm";
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
          <Modal>
            <Menus.Menu>
              {/* a menu has a mechanism to open/close it */}
              <Menus.Toggle id={cabinId} />
              {/* menu also has a list of buttons or actions */}
              <Menus.List id={cabinId}>
                {/* ideally would like modal for dupe function too but could not get it to work */}
                <Menus.Button
                  icon={<HiSquare2Stack title="Duplicate" />}
                  onClick={() =>
                    createCabin({
                      name: `Copy of ${name}`,
                      maxCapacity: maxCapacity,
                      regularPrice: regularPrice,
                      discount: discount,
                      image: image,
                      description: description,
                    })
                  }
                >
                  Dupe non-modal
                </Menus.Button>

                {/* button or other content that controls the modal's open state */}
                <Modal.Open opens="dupe-cabin">
                  <Menus.Button icon={<HiSquare2Stack title="Duplicate" />}>
                    Dupe Modal
                  </Menus.Button>
                </Modal.Open>

                <Modal.Open opens="cabin-form">
                  <Menus.Button icon={<HiPencil title="Edit" />}>
                    Edit
                  </Menus.Button>
                </Modal.Open>

                <Modal.Open opens="confirm-delete">
                  <Menus.Button icon={<HiTrash title="Delete" />}>
                    Delete
                  </Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>

            {/* content when opened */}
            <Modal.Window name="cabin-form">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>
            <Modal.Window name="confirm-delete">
              <ConfirmDelete
                resource="cabin"
                onConfirm={() => deleteCabin(cabinId)}
                disabled={isWorking}
              />
            </Modal.Window>
            <Modal.Window name="dupe-cabin">
              {/* tried {() => handleDuplicate()} and {handleDuplicate} below; neither closes the window after confirm */}
              <ConfirmDuplicate
                resource={`cabin ${cabin.name}`}
                onConfirm={() =>
                  createCabin({
                    name: `Copy of ${name}`,
                    maxCapacity: maxCapacity,
                    regularPrice: regularPrice,
                    discount: discount,
                    image: image,
                    description: description,
                  })
                }
                disabled={isWorking}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default CabinRow;

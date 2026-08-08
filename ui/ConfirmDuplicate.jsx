import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDuplicate = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmDuplicate({ resource, onConfirm, disabled, onCloseModal }) {
  //onCloseModal was appended to {children} props during createClone call in the modal.jsx
  //because this JSX is a children itself, it receives onCloseModal

  console.log(onCloseModal);

  return (
    <StyledConfirmDuplicate>
      <Heading as="h3">Duplicate {resource}</Heading>
      <p>Do you want to duplicate {resource}?</p>

      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          variation="primary"
          disabled={disabled}
          onClick={onConfirm}
        >
          Duplicate
        </Button>
      </div>
    </StyledConfirmDuplicate>
  );
}

export default ConfirmDuplicate;

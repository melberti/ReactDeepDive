import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;

  border: 2px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-500)"};

  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function Select({ options, activeValue, onChange, type }) {
  return (
    <StyledSelect
      onChange={onChange}
      value={activeValue}
      type={type}
    >
      {options.map((o) => (
        <option
          value={o.value}
          key={o.value}
        >
          {o.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;

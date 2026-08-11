import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.className === "active" &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({ filterValue, options }) {
  //filterValue is URL key
  //options will be a list of possible filters
  //each will have label, value
  const [filterParams, setFilterParams] = useSearchParams();
  const currentFilter = filterParams.get(filterValue) || options[0].value;

  function handleClick(value) {
    filterParams.set(filterValue, value);

    //actually resetting page param here
    //but only if it had been set already
    if (filterParams.get("page")) filterParams.set("page", 1);

    setFilterParams(filterParams);
  }

  if (!options) return null;
  return (
    <StyledFilter>
      {options.map((o) => (
        <FilterButton
          onClick={() => handleClick(o.value)}
          key={o.value}
          disabled={o.value === currentFilter}
          className={o.value === currentFilter ? "active" : ""}
        >
          {o.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;

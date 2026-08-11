import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "With Discount", value: "discount" },
    { label: "Without Discount", value: "no-discount" },
  ];

  const sortOptions = [
    {
      label: "Sort by Name [A-Z]",
      value: "name-asc",
    },
    { label: "Sort by Name [Z-A]", value: "name-desc" },
    { label: "Sort by Price [low-high]", value: "regularPrice-asc" },
    { label: "Sort by Price [high-low]", value: "regularPrice-desc" },
    { label: "Sort by Discount [low-high]", value: "discount-asc" },
    { label: "Sort by Discount [high-low]", value: "discount-desc" },
    { label: "Sort by Capacity [low-high]", value: "maxCapacity-asc" },
    { label: "Sort by Capacity [high-low]", value: "maxCapacity-desc" },
  ];

  return (
    <TableOperations>
      <Filter
        filterValue="discountFilter"
        options={filterOptions}
      ></Filter>
      <SortBy options={sortOptions}></SortBy>
    </TableOperations>
  );
}

export default CabinTableOperations;

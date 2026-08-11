import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [sortParams, setSortParams] = useSearchParams();
  const currentSort = sortParams.get("sortBy") || ""; //will select first value by default

  function handleChange(e) {
    sortParams.set("sortBy", e.target.value);
    setSortParams(sortParams);
  }
  return (
    <Select
      options={options}
      activeValue={currentSort}
      onChange={(e) => handleChange(e)}
      type="white"
    />
  );
}

export default SortBy;

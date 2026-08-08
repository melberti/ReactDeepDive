import { useSearchParams } from "react-router-dom";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CabinRow from "../cabins/CabinRow";
import { useCabins } from "./useCabins";
import Empty from "../../ui/Empty";

function CabinTable() {
  const { isLoading, error, cabins } = useCabins();

  const [searchParams] = useSearchParams();
  const discountFilter = searchParams.get("discountFilter") || "all"; //default to all if not found

  let filteredCabins;
  let sortedCabins;

  //don't try to do these until the data has loaded
  if (!isLoading) {
    if (discountFilter === "discount") {
      filteredCabins = cabins.filter(
        (cabin) => cabin.discount && cabin.discount > 0,
      );
    } else if (discountFilter === "no-discount") {
      filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
    } else {
      filteredCabins = cabins;
    }

    const sortBy = searchParams.get("sortBy") || "name-asc";
    const [sortCol, sortDir] = sortBy.split("-");

    //if ascending, multiply sort result by 1; if descending, by -1
    const modifier = sortDir === "asc" ? 1 : -1;
    sortedCabins = filteredCabins.sort((a, b) => {
      //we could do it this way, but using modifier below is simpler
      // return sortDir === "asc"
      //   ? a[sortCol] - b[sortCol]
      //   : b[sortCol] - a[sortCol];
      return (a[sortCol] - b[sortCol]) * modifier;
    });
    //}
  }

  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resource="cabins" />;

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => (
            <CabinRow
              cabin={cabin}
              key={cabin.id}
            />
          )}
        ></Table.Body>
        {/* {cabins.map((cabin) => (
        <CabinRow
          cabin={cabin}
          key={cabin.id}
        />
      ))} */}
      </Table>
    </Menus>
  );
}

export default CabinTable;

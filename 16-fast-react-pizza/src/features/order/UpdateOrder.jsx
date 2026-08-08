import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { useEffect } from "react";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  useEffect(function () {}, [fetcher]);

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {
  //console.log("update");

  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

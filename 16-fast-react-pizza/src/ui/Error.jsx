import { useRouteError } from "react-router-dom";
import AppLayout from "./AppLayout";
import LinkButton from "./LinkButton";

function Error() {
  const error = useRouteError();

  return (
    <AppLayout>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>

      <LinkButton to="-1">&larr; Go back</LinkButton>
    </AppLayout>
  );
}

export default Error;

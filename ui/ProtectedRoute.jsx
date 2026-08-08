import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var() (--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;
function ProtectedRoute({ children }) {
  //because navigate itself is a hook
  //it can only be called inside a hook or effect
  const navigate = useNavigate();

  //1. load current user
  const { isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      //this causes a loop with bad credentials
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [navigate, isLoading, isAuthenticated],
  );

  //2. while loading, show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //3. if none, redirect to login
  //see useEffect above; cannot call navigate outside of another function

  //4. if exists/authorized, show children (app)
  if (isAuthenticated) return children;
}

export default ProtectedRoute;

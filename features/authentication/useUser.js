import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuthentication";

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["user"],
  });

  console.log("useUser : " + user);
  return {
    user,
    isLoading,
    isAuthenticated: user?.role === "authenticated",
  };
}

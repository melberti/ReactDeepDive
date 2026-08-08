import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuthentication";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isLoading: isAuthenticating,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (data) => {
      //user = data returned by loginApi method
      toast.success("Login successful");

      //console.log("logged in user: " + JSON.stringify(data.data.user));

      //set user object into query cache
      //note that data has both a session object and a user object
      queryClient.setQueryData(["user"], data.data.user);

      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    login,
    isAuthenticating,
  };
}

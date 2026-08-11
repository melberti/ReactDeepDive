import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { signUp as signUpApi } from "../../services/apiAuthentication";

export function useSignUp() {
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      signUpApi({ fullName, email, password }),
    onSuccess: (data) => {
      //console.log("success data:", data.data?.user);

      toast.success(
        `User ${data.data?.user?.email} added successfully. Verify new account from user's email address.`,
      );
    },
    onError: (err) => toast.error(err.message),
  });

  return { signUp, isLoading };
}

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateUser as updateUserApi } from "../../services/apiAuthentication";

export function useUpdateUser() {
  //   console.log(
  //     "useUpdateUser pw: ",
  //     password,
  //     " fullName: ",
  //     fullName,
  //     " avatar: ",
  //     avatar,
  //   );
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: ({ fullName, avatar, password }) =>
      updateUserApi({ fullName, avatar, password }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      //note that this could also have been
      //queryClient.setQueryData(["user"], user) -- also requires {user} be received from onSuccess method
      toast.success("Account updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}

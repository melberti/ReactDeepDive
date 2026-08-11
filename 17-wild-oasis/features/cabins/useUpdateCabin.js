import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useUpdateCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isEditing, mutate: updateCabin } = useMutation({
    mutationFn: ({ cabin, id }) => createEditCabin(cabin, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["cabins"]);
      toast.success("Cabin updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, updateCabin };
}

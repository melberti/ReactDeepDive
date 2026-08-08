import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createCabin } from "../../services/apiCabins";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCabinForm() {
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { errors } = formState;
  function onHandleSubmit(data) {
    //modify the image property to get what we really need
    //console.log(data.image[0]);
    mutate({ ...data, image: data.image[0] });
  }

  function onHandleErrors(errors) {
    console.log(errors);
  }

  const queryClient = useQueryClient();

  const { isLoading: isAdding, mutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      queryClient.invalidateQueries(["cabins"]);
      reset();
      toast.success("Cabin created successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Form onSubmit={handleSubmit(onHandleSubmit, onHandleErrors)}>
      <FormRow
        label="Name"
        error={errors?.name?.message}
      >
        <Input
          type="text"
          id="name"
          disabled={isAdding}
          {...register("name", { required: "Required field" })}
        />
      </FormRow>

      <FormRow
        label="Maximum capacity"
        error={errors?.maxCapacity?.message}
      >
        <Input
          type="number"
          id="maxCapacity"
          disabled={isAdding}
          {...register("maxCapacity", {
            required: "Required field",
            min: { value: 1, message: "Min capacity 1" },
            max: { value: 8, message: "Max capacity 8" },
          })}
        />
      </FormRow>

      <FormRow
        label="Regular price"
        error={errors?.regularPrice?.message}
      >
        <Input
          type="number"
          id="regularPrice"
          disabled={isAdding}
          {...register("regularPrice", {
            required: "Required field",
            min: { value: 1, message: "Min price $1" },
          })}
        />
      </FormRow>

      <FormRow
        label="Discount"
        error={errors?.discount?.message}
      >
        <Input
          type="number"
          id="discount"
          disabled={isAdding}
          defaultValue={0}
          {...register("discount", {
            required: "Required field",
            validate: (currentVal) =>
              currentVal <= getValues().regularPrice ||
              "Discount must be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isAdding}
          defaultValue=""
          {...register("description", { required: "Required field" })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isAdding}
          {...register("image", { required: "Required field" })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isAdding}
        >
          Reset
        </Button>
        <Button disabled={isAdding}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

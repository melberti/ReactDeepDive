import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  //for editing
  const { id: editId, ...editValues } = cabinToEdit;

  const isEdit = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEdit ? editValues : {},
  });

  const { updateCabin, isUpdating } = useUpdateCabin();
  const { createCabin, isCreating } = useCreateCabin();

  const { errors } = formState;
  function onHandleSubmit(data) {
    //modify the image property to get what we really need
    //data.image[0] for newly uploaded
    //string for existing without change

    const image = typeof data.image === "string" ? data.image : data.image[0];

    //for edit, we need to pass cabin data plus id into the mutate function
    //so first define the cabin data as an object
    //create needs only the cabin data as there is no id
    //onSuccess callback function has access to the returned data and error if we want to use or log them
    if (isEdit)
      updateCabin(
        { cabin: { ...data, image: image }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        },
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        },
      );
  }
  // { onSuccess: (data) => reset() },

  function onHandleErrors(errors) {
    console.error(errors);
  }

  const isInProgress = isCreating || isUpdating;

  return (
    <Form
      onSubmit={handleSubmit(onHandleSubmit, onHandleErrors)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow
        label="Name"
        error={errors?.name?.message}
      >
        <Input
          type="text"
          id="name"
          disabled={isInProgress}
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
          disabled={isInProgress}
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
          step="any"
          id="regularPrice"
          disabled={isInProgress}
          {...register("regularPrice", {
            required: "Required field",
            min: { value: 1, message: "Min price $1" },
          })}
        />
      </FormRow>

      <FormRow
        label="Discount"
        step="any"
        error={errors?.discount?.message}
      >
        <Input
          type="number"
          id="discount"
          disabled={isInProgress}
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
          disabled={isInProgress}
          defaultValue=""
          {...register("description", { required: "Required field" })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isInProgress}
          {...register("image", {
            required: isEdit ? false : "Required field",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}

        <Button
          variation="secondary"
          disabled={isInProgress}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button
          variation="secondary"
          type="reset"
          disabled={isInProgress}
        >
          Reset
        </Button>
        <Button disabled={isInProgress}>
          {isEdit ? "Update cabin" : "Add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors } = formState;

  function onFormSubmit() {
    console.log(data);
  }

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <FormRow
        label="Full name"
        error={""}
      >
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "Required" })}
        />
      </FormRow>

      <FormRow
        label="Email address"
        error={""}
      >
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={""}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "Required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
          })}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        error={""}
      >
        <Input
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "Required",
            validate: (value) =>
              value === getValues().password || "Repeat password not matched",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
        >
          Cancel
        </Button>
        <Button>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;

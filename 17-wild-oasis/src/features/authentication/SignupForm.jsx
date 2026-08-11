import { useForm } from "react-hook-form";
import { useSignUp } from "./useSignUp";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMin from "../../ui/SpinnerMini";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { signUp, isLoading } = useSignUp();

  //function onFormSubmit(data) {
  function onFormSubmit({ fullName, email, password }) {
    //no validaiton required since we are validating below with required fields etc
    //console.log(data);
    signUp({ fullName, email, password }, { onSettled: reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <FormRow
        label="Full name"
        error={errors?.fullName?.message}
      >
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "Required" })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow
        label="Email address"
        error={errors?.email?.message}
      >
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "Required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "Required",
            validate: (value) =>
              value === getValues().password || "Repeat password not matched",
          })}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : "Create new user"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;

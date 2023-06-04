import { Navigate } from "@solidjs/router";
import { createFormControl, createFormGroup } from "solid-forms";
import { Match, Switch, createEffect } from "solid-js";
import toast, { Toaster } from "solid-toast";
import Button from "./Button";
import FormField from "./form/FormField";
import FormInput from "./form/FormInput";
import FormLabel from "./form/FormLabel";
import { emailValidator, requiredValidator } from "./form/validators";
import { useLogin, useUser } from "./lib/api";

const Login = () => {
  const login = useLogin();
  const user = useUser();
  const formGroup = createFormGroup({
    email: createFormControl("", {
      required: true,
      validators: [requiredValidator, emailValidator],
    }),
    password: createFormControl("", {
      required: true,
      validators: [requiredValidator],
    }),
  });

  const onSubmit = (e: Event) => {
    e.preventDefault();

    const { email, password } = formGroup.value;
    login.mutate({ email: email!, password: password! });
  };

  createEffect(() => {
    if (login.isError) {
      toast.error("Error logging in!");
    }
  });

  return (
    <Switch>
      <Match when={user.data !== null}>
        <Navigate href="/" />
      </Match>
      <Match when={user.data === null}>
        <div class="flex m-auto flex-col">
          <form onSubmit={onSubmit}>
            <FormField>
              <FormLabel for="email">Email</FormLabel>
              <FormInput
                name="email"
                control={formGroup.controls.email}
                type="email"
              />
            </FormField>
            <FormField>
              <FormLabel for="password">Password</FormLabel>
              <FormInput
                name="password"
                control={formGroup.controls.password}
                type="password"
              />
            </FormField>
            <div class="flex items-center justify-center mt-5">
              <Button
                onClick={onSubmit}
                class="w-full"
                disabled={!formGroup.isValid}
              >
                {login.isLoading ? "Please Wait..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
        <Toaster position="top-center" />
      </Match>
    </Switch>
  );
};

export default Login;

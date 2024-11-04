import clsx from "clsx";
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import styles from "~/components/SignIn/SignIn.module.css";
import Title from "~/components/Title";
import { useToast } from "~/components/Toast";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  userEmail: string;
  userPassword: string;
};

type State = {
  isInProgress: boolean;
};

export default function SignIn() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isInProgress: true });
  const [_, setLocation] = useLocation();
  const { formState: { errors }, handleSubmit, register, setError } = useForm<Form>({});
  const { showToast } = useToast();

  async function submit(data: Form) {
    try {
      setState((s) => ({ ...s, isInProgress: true }));

      /* TODO: Change endpoint */
      const response = await api.post("/sign-in", data);
      const responseJson = await response.json();

      if (response.ok) {
        showToast({ message: "You have successfully signed in.", variant: "success" });

        setLocation("/");
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    } finally {
      setState((s) => ({ ...s, isInProgress: false }));
    }
  }

  return (
    <>
      <Title>Sign In</Title>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.title}>
            <small className={styles.description}>Sign in</small>

            <h1 className={styles.heading}>
              Welcome back!
            </h1>

            <p>
              Sign in to view your analytics dashboard.
            </p>
          </div>

          <div className={clsx("card", styles.card)}>
            <form className="card-body" onSubmit={handleSubmit(submit)}>
              <fieldset className="fieldset" disabled={state.isInProgress}>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                  <input
                    className={clsx("input", errors.userEmail && "input-invalid")}
                    id="input-user-email"
                    required
                    type="email"
                    {...register("userEmail")}
                  />

                  {!!errors.userEmail ? (
                    <div className="form-error">{errors.userEmail.message}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label className="form-label">New password</label>

                  <input className="input" required type="password" {...register("userPassword")} />

                  {!!errors.userPassword ? (
                    <div className="form-error">{errors.userPassword.message}</div>
                  ) : null}
                </div>

                <button className="button button-blue" type="submit">Sign in</button>
              </fieldset>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

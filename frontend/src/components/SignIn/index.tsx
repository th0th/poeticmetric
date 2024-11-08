import clsx from "clsx";
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import FormTitle from "./FormTitle";
import Layout from "~/components/Layout";
import styles from "./SignIn.module.css";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  userEmail: string;
  userPassword: string;
};

type State = {
  isAlreadySignedIn: boolean;
  isSignInComplete: boolean;
};

export default function SignIn() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isAlreadySignedIn: false, isSignInComplete: true });
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      setState((s) => ({ ...s, isInProgress: true }));

      /* TODO: Change endpoint */
      const response = await api.post("/authentication/user-access-tokens", data);
      const responseJson = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", responseJson.accessToken);

        setState((prev) => ({ ...prev, isSignInComplete: true }));
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

      {state.isAlreadySignedIn ? (
        <Layout>
          <div className="container">
            <FormTitle
              actions={(
                <Link className="button button-lg button-blue" to="/sites">
                  Go to dashboard
                </Link>
              )}
              description="It looks like you're already signed in."
              summary="Sign in"
              title="Signed in!"
            />
          </div>
        </Layout>
      ) : state.isSignInComplete ? (
        <Layout>
          <div className="container">
            <FormTitle
              actions={(
                <Link className="button button-lg button-blue" to="/sites">
                  Go to dashboard
                </Link>
              )}
              description="You're successfully signed in."
              summary="Sign in"
              title="Signed in!"
            />
          </div>
        </Layout>
      ) : (
        <Layout>
          <div className="container">
            <FormTitle
              description="Sign in to view your analytics dashboard."
              summary="Sign in"
              title="Welcome back!"
            />

            <div className={clsx("card", styles.card)}>
              <ActivityOverlay isActive={isSubmitting}>
                <form className="card-body" onSubmit={handleSubmit(submit)}>
                  <fieldset className="fieldset" disabled={isSubmitting}>
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
                      <div className={styles.forgotPasswordLink}>
                        <label className="form-label">Password</label>

                        <a className="link link-muted" href="/forgot-password" tabIndex={1}>Forgot password?</a>
                      </div>

                      <input
                        className={clsx("input", errors.userPassword && "input-invalid")}
                        required
                        type="password"
                        {...register("userPassword")}
                      />

                      {!!errors.userPassword ? (
                        <div className="form-error">{errors.userPassword.message}</div>
                      ) : null}
                    </div>

                    <button className="button button-blue" type="submit">Sign in</button>
                  </fieldset>
                </form>

                <div className="card-footer">
                  <p className={styles.signUpLink}>
                    {"Don't have an account?"}
                    {" "}
                    <Link className="link link-animate" style={{ marginBlock: "3rem" }} to="/sign-up">Sign up</Link>
                  </p>
                </div>
              </ActivityOverlay>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

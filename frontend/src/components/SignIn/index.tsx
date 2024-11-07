import clsx from "clsx";
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Layout from "~/components/Layout";
import styles from "~/components/SignIn/SignIn.module.css";
import Title from "~/components/Title";
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
  const [isAlreadySignedIn] = useState<boolean>(false);
  const [signedIn, setSignedIn] = useState<boolean>(true);
  const [state, setState] = useState<State>({ isInProgress: false });
  const { formState: { errors }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      setState((s) => ({ ...s, isInProgress: true }));

      const response = await api.post("/authentication/user-access-tokens", data);
      const responseJson = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", responseJson.accessToken);

        setSignedIn(true);
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

      {isAlreadySignedIn ? (
        <Layout verticallyCenter>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Sign in</small>

              <h2 className={styles.heading}>
                Signed in!
              </h2>

              <p>
                It looks like you're already signed in.
              </p>

              <div className={styles.buttonGroup}>
                <Link className="button button-lg button-blue" to="/sites">
                  Go to dashboard
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      ) : signedIn ? (
        <Layout verticallyCenter>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Sign in</small>

              <h2 className={styles.heading}>
                Signed in!
              </h2>

              <p>
                You're successfully signed in.
              </p>

              <div className={styles.buttonGroup}>
                <Link className="button button-lg button-blue" to="/sites">
                  Go to dashboard
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      ) : (
        <Layout verticallyCenter>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Sign in</small>

              <h1 className={styles.heading}>
                Welcome back!
              </h1>

              <p>
                Sign in to view your analytics dashboard.
              </p>
            </div>

            <div className={clsx("card", styles.card)}>
              <ActivityOverlay isActive={state.isInProgress}>
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
                      <label className="form-label">Password</label>

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
              </ActivityOverlay>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

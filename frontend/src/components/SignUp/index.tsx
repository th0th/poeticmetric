import clsx from "clsx";
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import AuthenticationHeader from "~/components/AuthenticationHeader";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import styles from "./SignUp.module.css";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  organizationName: string;
  userEmail: string;
  userName: string;
  userPassword: string;
};

type State = {
  isInProgress: boolean;
};

export default function SignUp() {
  const { showBoundary } = useErrorBoundary();
  const [isAlreadySignedIn] = useState<boolean>(false);
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [state, setState] = useState<State>({ isInProgress: false });
  const { formState: { errors }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      setState((s) => ({ ...s, isInProgress: true }));

      /* TODO: Change the endpoint */
      const response = await api.post("", data);
      const responseJson = await response.json();

      if (response.ok) {
        setSignedUp(true);
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
      <Title>Sign up</Title>

      {isAlreadySignedIn ? (
        <Layout>
          <div className="container">
            <AuthenticationHeader
              actions={(
                <>
                  <Link className="button button-lg button-blue" to="/sites">
                    Go to dashboard
                  </Link>
                </>
              )}
              description="It looks like you're already signed in."
              summary="Sign up"
              title="You are in!"
            />
          </div>
        </Layout>
      ) : signedUp ? (
        <Layout>
          <div className="container">
            <AuthenticationHeader
              actions={(
                <>
                  <Link className="button button-lg button-blue" to="/sites">
                    Go to dashboard
                  </Link>
                </>
              )}
              description="You're successfully signed up."
              summary="Sign up"
              title="Signed up!"
            />
          </div>
        </Layout>
      ) : (
        <Layout>
          <div className="container">
            <AuthenticationHeader
              description="Sign up to create your analytics dashboard."
              summary="Sign up"
              title={(
                <>
                  Welcome to
                  <br />
                  PoeticMetric!
                </>
              )}
            />

            <div className={clsx("card", styles.card)}>
              <ActivityOverlay isActive={state.isInProgress}>
                <form className="card-body" onSubmit={handleSubmit(submit)}>
                  <fieldset className="fieldset" disabled={state.isInProgress}>

                    <div className="form-group">
                      <label className="form-label" htmlFor="input-user-name">Full name</label>

                      <input
                        className={clsx("input", errors.userName && "input-invalid")}
                        id="input-user-name"
                        required
                        {...register("userName")}
                      />

                      {!!errors.userName ? (
                        <div className="form-error">{errors.userName.message}</div>
                      ) : null}
                    </div>

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

                    <div className="form-group">
                      <label className="form-label">Company name</label>

                      <input
                        className={clsx("input", errors.organizationName && "input-invalid")}
                        required
                        {...register("organizationName")}
                      />

                      {!!errors.organizationName ? (
                        <div className="form-error">{errors.organizationName.message}</div>
                      ) : null}
                    </div>

                    <button className="button button-blue" type="submit">Sign up</button>
                  </fieldset>
                </form>

                <div className="card-footer">
                  <p className={styles.signInLink}>
                    {"Have an account?"}
                    {" "}
                    <Link className="link link-animate" style={{ marginBlock: "3rem" }} to="/sign-in">Sign in</Link>
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

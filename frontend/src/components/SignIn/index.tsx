import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useLocation, useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import { base64Encode } from "~/helpers/base64";
import useUser from "~/hooks/useUser";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";
import FormTitle from "./FormTitle";
import styles from "./SignIn.module.css";

type Form = {
  userEmail: string;
  userPassword: string;
};

type State = {
  isAlreadySignedIn: boolean;
};

export default function SignIn() {
  const { showBoundary } = useErrorBoundary();
  const location = useLocation();
  const searchParams = useSearch();
  const user = useUser();
  const [state, setState] = useState<State>({ isAlreadySignedIn: false });
  const { clearErrors, formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>();

  useEffect(() => {
    if (user) {
      setState((prev) => ({ ...prev, isAlreadySignedIn: true }));
    }
  }, []);

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/user-access-tokens", undefined, {
        headers: {
          authorization: `Basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
        },
      });

      const responseJson = await response.json();

      if (response.ok) {
        setUserAccessToken(responseJson.accessToken);

        const next = new URLSearchParams(searchParams).get("next");

        location.push(next || "/sites");
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Sign In</Title>

      <Layout className={styles.layout} headerProps={{ variant: "basic" }}>
        {state.isAlreadySignedIn ? (
          <div className="container">
            <FormTitle
              actions={(
                <Link className="button button-lg button-blue" to="/sites">
                  Go to dashboard
                </Link>
              )}
              description="It looks like you are already signed in."
              summary="Sign in"
              title="Signed in!"
            />
          </div>
        ) : (
          <div className="container">
            <FormTitle
              description="Sign in to view your analytics dashboard."
              maxWidth="28rem"
              showGoBack={false}
              summary="Sign in"
              title="Welcome back!"
            />

            <div className={clsx("card", styles.card)}>
              <ActivityOverlay isActive={isSubmitting}>
                <form className="card-body" onSubmit={handleSubmit(submit)}>
                  <fieldset className="fieldset" disabled={isSubmitting}>
                    {errors.root ? (
                      <div className="alert alert-danger">
                        <IconX className="icon" size={24} />

                        {errors.root.message}
                      </div>
                    ) : null}

                    <div className="form-group">
                      <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                      <input
                        className={clsx("input", !!errors.userEmail || !!errors.root && "input-invalid")}
                        id="input-user-email"
                        required
                        type="email"
                        {...register("userEmail", { onChange: () => clearErrors() })}
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
                        className={clsx("input", errors.userPassword || errors.root && "input-invalid")}
                        required
                        type="password"
                        {...register("userPassword", { onChange: () => clearErrors() })}
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
                    <Link className="link link-animate" to="/sign-up">Sign up</Link>
                  </p>
                </div>
              </ActivityOverlay>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

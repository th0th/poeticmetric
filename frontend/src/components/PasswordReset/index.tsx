import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import useUser from "~/hooks/useUser";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import FormTitle from "./FormTitle";
import styles from "./PasswordReset.module.css";

type State = {
  isAlreadySignedIn: boolean;
  isPasswordUpdated: boolean;
  isTokenValid: boolean;
};

type Form = {
  passwordResetToken: string;
  userPassword: string;
  userPassword2: string;
};

export default function PasswordReset() {
  const { showBoundary } = useErrorBoundary();
  const search = useSearch();
  const user = useUser();
  const token = new URLSearchParams(search).get("t");
  const [state, setState] = useState<State>({ isAlreadySignedIn: false, isPasswordUpdated: false, isTokenValid: false });
  const { clearErrors, formState: { errors, isSubmitting }, handleSubmit, register, reset, setError } = useForm<Form>();

  useEffect(() => {
    if (user) {
      setState((prev) => ({ ...prev, isAlreadySignedIn: true }));
    }
  }, [user]);

  useEffect(() => {
    setState((prev) => ({ ...prev, isTokenValid: !!token }));
  }, [token]);

  useEffect(() => {
    if (!!errors.passwordResetToken) {
      setState((prev) => ({ ...prev, isTokenValid: false }));

      reset();
    }
  }, [errors.passwordResetToken]);

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/reset-user-password", {
        ...data,
      });

      const responseJson = await response.json();

      if (response.ok) {
        setState((prev) => ({ ...prev, isPasswordUpdated: true }));
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Reset password</Title>

      <Layout className={styles.layout}>
        {state.isAlreadySignedIn ? (
          <div className="container">
            <FormTitle
              actions={(
                <Link className="button button-lg button-blue" to="/settings">
                  Go to settings
                </Link>
              )}
              description="You can reset your password from user settings."
              summary="Password reset"
              title="You are already in!"
            />
          </div>
        ) : state.isTokenValid ?
          state.isPasswordUpdated ? (
            <div className="container">
              <FormTitle
                actions={(
                  <Link className="button button-lg button-blue" to="/sign-in">
                    Sign in to your account
                  </Link>
                )}
                description="You succesfully reset your password."
                showGoBack={false}
                summary="Password reset"
                title="You are all set!"
              />
            </div>
          ) : (
            <div className="container">
              <FormTitle
                description="Enter a new password to access your account."
                maxWidth="30rem"
                showGoBack={false}
                summary="Password reset"
                title="Reset your password"
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

                      <input
                        className={styles.visuallyHidden}
                        {...register("passwordResetToken", {
                          onChange: () => clearErrors(),
                          value: token || "",
                        })}
                      />

                      <div className="form-group">
                        <label className="form-label" htmlFor="input-user-password">Password</label>

                        <input
                          className={clsx("input", (!!errors.userPassword || !!errors.root) && "input-invalid")}
                          id="input-user-password"
                          required
                          type="password"
                          {...register("userPassword", { onChange: () => clearErrors() })}
                        />

                        {!!errors.userPassword ? (
                          <div className="form-error">{errors.userPassword.message}</div>
                        ) : null}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="input-user-password2">Password (again)</label>

                        <input
                          className={clsx("input", (!!errors.userPassword2 || !!errors.root) && "input-invalid")}
                          id="input-user-password2"
                          required
                          type="password"
                          {...register("userPassword2", { onChange: () => clearErrors() })}
                        />

                        {!!errors.userPassword2 ? (
                          <div className="form-error">{errors.userPassword2.message}</div>
                        ) : null}
                      </div>

                      <button className="button button-blue" type="submit">Reset password</button>
                    </fieldset>
                  </form>
                </ActivityOverlay>
              </div>
            </div>
          ) : (
            <div className="container">
              <FormTitle
                actions={(
                  <>
                    <Link className="button button-lg button-blue" to="/forgot-password">
                      Request new link
                    </Link>

                    <a className="button button-lg button-blue-ghost" href="mailto:support@poeticmetric.com">
                      Contact support
                    </a>
                  </>
                )}
                description="Your link is invalid or expired. Request a new one or contact support for help."
                maxWidth="28rem"
                showGoBack={false}
                summary="Password reset"
                title="Ooops, invalid link!"
              />
            </div>
          )}
      </Layout>
    </>
  );
}

import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import FormTitle from "~/components/FormTitle";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import useUser from "~/hooks/useUser";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import styles from "./PasswordRecovery.module.css";

type Form = {
  userEmail: string;
};

type State = {
  isAlreadySignedIn: boolean;
  isEmailSent: boolean;
};

export default function PasswordRecovery() {
  const { showBoundary } = useErrorBoundary();
  const searchParams = useSearch();
  const [state, setState] = useState<State>({ isAlreadySignedIn: false, isEmailSent: false });
  const user = useUser();
  const { clearErrors, formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>({
    defaultValues: {
      userEmail: new URLSearchParams(searchParams).get("email") || "",
    },
  });

  useEffect(() => {
    if (user) {
      setState((prev) => ({ ...prev, isAlreadySignedIn: true }));
    }
  }, [user]);

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/send-user-password-recovery-email", {
        email: data.userEmail,
      });
      const responseJson = await response.json();

      if (response.ok) {
        setState((prev) => ({ ...prev, isEmailSent: true }));
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Forgot password?</Title>

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
              summary="Password recovery"
              title="You are already in!"
            />
          </div>
        ) : state.isEmailSent ? (
          <div className="container">
            <FormTitle
              actions={(
                <Link className="button button-lg button-blue" to="/sign-in">
                  Return to sign in
                </Link>
              )}
              description="If the e-mail address exists in our database, you will receive a reset link. Check your inbox and follow the instructions."
              maxWidth="28rem"
              showGoBack={false}
              summary="Password recovery"
              title="Check your inbox"
            />
          </div>
        ) : (
          <div className="container">
            <FormTitle
              description="Enter your email address and we will send you a link to reset your password."
              maxWidth="27rem"
              showGoBack={false}
              summary="Password recovery"
              title="Forgot password?"
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
                        className={clsx("input", errors.userEmail || errors.root && "input-invalid")}
                        id="input-user-email"
                        required
                        type="email"
                        {...register("userEmail", { onChange: () => clearErrors() })}
                      />

                      {!!errors.userEmail ? (
                        <div className="form-error">{errors.userEmail.message}</div>
                      ) : null}
                    </div>

                    <button className="button button-blue" type="submit">Continue</button>
                  </fieldset>
                </form>

                <div className="card-footer">
                  <p className={styles.signInLink}>
                    {"Remember your password? "}
                    <Link className="link link-animate" to="/sign-in">Sign in</Link>
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

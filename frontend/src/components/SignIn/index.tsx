import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useLocation, useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import FormGroup from "~/components/FormGroup";
import FormTitle from "~/components/FormTitle";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import { base64Encode } from "~/helpers/base64";
import useUser from "~/hooks/useUser";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";
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
  const methods = useForm<Form>();
  const forgetPasswordLink = !!methods.getValues("userEmail") ? `/forgot-password?email=${methods.getValues("userEmail")}` : "/forgot-password";

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
        setErrors(methods.setError, responseJson);
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
              <ActivityOverlay isActive={methods.formState.isSubmitting}>
                <FormProvider {...methods}>
                  <form className="card-body" onSubmit={methods.handleSubmit(submit)}>
                    <fieldset className="fieldset" disabled={methods.formState.isSubmitting}>
                      {methods.formState.errors.root ? (
                        <div className="alert alert-danger">
                          <IconX className="icon" size={24} />

                          {methods.formState.errors.root.message}
                        </div>
                      ) : null}

                      <FormGroup
                        id="input-user-email"
                        inputProps={{
                          autoComplete: "email",
                          required: true,
                          type: "email",
                        }}
                        labelText="E-mail address"
                        name="userEmail"
                      />

                      <FormGroup
                        id="input-user-password"
                        inputProps={{ autoComplete: "current-password", required: true, type: "password" }}
                        labelHelper={(
                          <Link className={clsx("link link-muted", styles.forgotPasswordLink)} href={forgetPasswordLink} tabIndex={1}>
                            Forgot password?
                          </Link>
                        )}
                        labelText="Password"
                        name="userPassword"
                      />

                      <button className="button button-blue" type="submit">Sign in</button>
                    </fieldset>
                  </form>
                </FormProvider>
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

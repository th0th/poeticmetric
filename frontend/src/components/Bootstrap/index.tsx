import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import FormGroup from "~/components/FormGroup";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import { base64Encode } from "~/helpers/base64";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";
import styles from "./Bootstrap.module.css";

type Form = {
  createDemoSite: boolean;
  organizationName: string;
  userEmail: string;
  userName: string;
  userPassword: string;
  userPassword2: string;
};

type State = {
  isAlreadyBootstrapped: boolean;
  isBootstrapComplete: boolean;
  isInProgress: boolean;
};

export default function Bootstrap() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isAlreadyBootstrapped: false, isBootstrapComplete: false, isInProgress: true });
  const methods = useForm<Form>({
    defaultValues: { createDemoSite: false },
  });

  async function submit(data: Form) {
    try {
      const response = await api.post("/bootstrap", data);
      const responseJson = await response.json();

      if (response.ok) {
        const accessTokenResponse = await api.post("/authentication/user-access-tokens", undefined, {
          headers: {
            authorization: `Basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
          },
        });

        const accessTokenResponseJson = await accessTokenResponse.json();

        if (accessTokenResponse.ok) {
          setUserAccessToken(accessTokenResponseJson.accessToken);
        } else {
          setErrors(methods.setError, accessTokenResponseJson);
        }
        setState((prev) => ({ ...prev, isBootstrapComplete: true }));
      } else {
        setErrors(methods.setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  useEffect(() => {
    async function run() {
      try {
        const response = await api.get("/bootstrap");

        if (!response.ok) {
          setState((prev) => ({ ...prev, isAlreadyBootstrapped: true }));
        }
      } catch (error) {
        showBoundary(error);
      } finally {
        setState((prev) => ({ ...prev, isInProgress: false }));
      }
    }

    run();
  }, []);

  return (
    <>
      <Title>Complete PoeticMetric installation</Title>

      {state.isInProgress ? (
        <Layout>
          <div className="spinner-full">
            <div className="spinner spinner-lg" />
          </div>
        </Layout>
      ) : state.isAlreadyBootstrapped ? (
        <Layout>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Bootstrap</small>

              <h1 className={styles.heading}>
                Already bootstrapped!
              </h1>

              <p>
                It looks like PoeticMetric has already been installed.
              </p>

              <div className={styles.buttonGroup}>
                <Link className="button button-lg button-blue" to="/">
                  Return home
                </Link>

                <a className="button button-lg button-blue-ghost" href="mailto:support@poeticmetric.com">
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </Layout>
      ) : state.isBootstrapComplete ? (
        <Layout>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Bootstrap</small>

              <h1 className={styles.heading}>
                You are all set!
              </h1>

              <p>
                PoeticMetric has been successfully installed.
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
        <Layout>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Bootstrap</small>

              <h1 className={styles.heading}>
                Welcome to
                <br />
                PoeticMetric!
              </h1>

              <p>Complete PoeticMetric installation to continue.</p>
            </div>

            <div className={clsx("card", styles.card)}>
              <ActivityOverlay isActive={methods.formState.isSubmitting}>
                <FormProvider {...methods}>
                  <form className="card-body" onSubmit={methods.handleSubmit(submit)}>
                    <fieldset className="fieldset" disabled={methods.formState.isSubmitting}>
                      <FormGroup
                        id="input-user-name"
                        labelText="Full name"
                        name="userName"
                      />

                      <FormGroup
                        id="input-user-email"
                        inputProps={{
                          type: "email",
                        }}
                        labelText="E-mail address"
                        name="userEmail"
                      />

                      <FormGroup
                        id="input-user-password"
                        inputProps={{
                          type: "password",
                        }}
                        labelText="New password"
                        name="userPassword"
                      />

                      <FormGroup
                        id="input-user-password2"
                        inputProps={{
                          type: "password",
                        }}
                        labelText="New password (again)"
                        name="userPassword2"
                      />

                      <FormGroup
                        id="input-organization-name"
                        labelText="Organization"
                        name="organizationName"
                      />

                      <FormGroup
                        id="input-create-demo-site"
                        inputProps={{
                          required: false,
                          type: "checkbox",
                        }}
                        labelText="Create demo site"
                        name="createDemoSite"
                      />

                      <button className="button button-blue" type="submit">Complete installation</button>
                    </fieldset>
                  </form>
                </FormProvider>
              </ActivityOverlay>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

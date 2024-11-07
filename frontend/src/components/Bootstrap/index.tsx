import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
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
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      const response = await api.post("/bootstrap", data);
      const responseJson = await response.json();

      if (response.ok) {
        setState((prev) => ({ ...prev, isBootstrapComplete: true }));
      } else {
        setErrors(setError, responseJson);
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

              <h2 className={styles.heading}>
                Already bootstrapped!
              </h2>

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

              <h2 className={styles.heading}>
                You are all set!
              </h2>

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
              <ActivityOverlay isActive={isSubmitting}>
                <form className="card-body" onSubmit={handleSubmit(submit)}>
                  <fieldset className="fieldset" disabled={isSubmitting}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="input-user-name">Full name</label>

                      <input
                        className={clsx("input", errors.userName && "input-invalid")}
                        id="input-user-name"
                        required
                        {...register("userName")}
                      />

                      {!!errors.userName ? (<div>{errors.userName.message}</div>) : null}
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

                      {!!errors.userEmail ? (<div className="form-error">{errors.userEmail.message}</div>) : null}
                    </div>

                    <div className="form-group">
                      <label className="form-label">New password</label>

                      <input
                        className={clsx("input", errors.userPassword && "input-invalid")}
                        required
                        type="password"
                        {...register("userPassword")}
                      />

                      {!!errors.userPassword ? (<div className="form-error">{errors.userPassword.message}</div>) : null}
                    </div>

                    <div className="form-group">
                      <label className="form-label">New password (again)</label>

                      <input
                        className={clsx("input", errors.userPassword2 && "input-invalid")}
                        required
                        type="password"
                        {...register("userPassword2")}
                      />

                      {!!errors.userPassword2 ? (<div className="form-error">{errors.userPassword2.message}</div>) : null}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Organization</label>

                      <input
                        className={clsx("input", errors.organizationName && "input-invalid")}
                        required
                        {...register("organizationName")}
                      />

                      {!!errors.organizationName ? (<div className="form-error">{errors.organizationName.message}</div>) : null}
                    </div>

                    <div className="form-group">
                      <div className="form-group-inline">
                        <input
                          className={clsx(errors.createDemoSite && "input-invalid")}
                          id="input-create-demo-site"
                          type="checkbox"
                          {...register("createDemoSite")}
                        />

                        <label htmlFor="input-create-demo-site">Create demo site</label>
                      </div>

                      {!!errors.createDemoSite ? (<div className="form-error">{errors.createDemoSite.message}</div>) : null}
                    </div>

                    <button className="button button-blue" type="submit">Complete installation</button>
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

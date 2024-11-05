import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  isInProgress: boolean;
  isSubmitInProgress: boolean;
};

export default function Bootstrap() {
  const [isAlreadyBootstrapped, setIsAlreadyBootstrapped] = useState<boolean>(false);
  const [isBootstrapped, setIsBootstrapped] = useState<boolean>(false);
  const { showBoundary } = useErrorBoundary();
  const initialized = useRef(false);
  const [state, setState] = useState<State>({ isInProgress: true, isSubmitInProgress: false });
  const { formState: { errors }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      setState((s) => ({ ...s, isSubmitInProgress: true }));

      const response = await api.post("/bootstrap", data);
      const responseJson = await response.json();

      if (response.ok) {
        setIsBootstrapped(true);
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    } finally {
      setState((s) => ({ ...s, isSubmitInProgress: false }));
    }
  }

  useEffect(() => {
    async function run() {
      try {
        const response = await api.get("/bootstrap");

        if (!response.ok) {
          setIsAlreadyBootstrapped(true);
        }
      } catch (error) {
        showBoundary(error);
      } finally {
        setState((s) => ({ ...s, isInProgress: false }));
      }
    }

    if (!initialized.current) {
      initialized.current = true;

      run();
    }
  }, []);

  return (
    <>
      <Title>Complete PoeticMetric installation</Title>

      {state.isInProgress ? (
        <Layout verticallyCenter>
          <div className="spinner-full">
            <div className="spinner spinner-lg" />
          </div>
        </Layout>
      ) : isAlreadyBootstrapped ? (
        <Layout verticallyCenter>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Bootstrap</small>

              <h2 className={styles.heading}>
                Already bootstrapped!
              </h2>

              <p>
                It looks like PoeticMetric has already been initialized.
              </p>

              <div className={styles.buttonGroup}>
                <Link className="button button-lg button-blue" to="/">
                  Return home
                </Link>

                <a className="button button-lg button-blue-ghost" href="mailto:info@poeticmetric.com">
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </Layout>
      ) : isBootstrapped ? (
        <Layout verticallyCenter>
          <div className="container">
            <div className={styles.title}>
              <small className={styles.summary}>Bootstrap</small>

              <h2 className={styles.heading}>
                You are all set!
              </h2>

              <p>
                PoeticMetric has been successfully initialized.
              </p>

              <div className={styles.buttonGroup}>
                <Link className="button button-lg button-blue" to="/sign-up">
                  Sign up to create dashboard
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      ) : (
        <Layout verticallyCenter>
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
              <ActivityOverlay isActive={state.isSubmitInProgress}>
                <form className="card-body" onSubmit={handleSubmit(submit)}>
                  <fieldset className="fieldset" disabled={state.isSubmitInProgress}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="input-user-name">Full name</label>

                      <input className={clsx("input", errors.userName && "input-invalid")} id="input-user-name" required {...register("userName")} />

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

                      <input className={clsx("input", errors.userPassword && "input-invalid")} required type="password" {...register("userPassword")} />

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

                      <input className={clsx("input", errors.organizationName && "input-invalid")} required {...register("organizationName")} />

                      {!!errors.organizationName ? (<div className="form-error">{errors.organizationName.message}</div>) : null}
                    </div>

                    <div className="form-group">
                      <div className="form-group-inline">
                        <input className={clsx(errors.createDemoSite && "input-invalid")} id="input-create-demo-site" type="checkbox" {...register("createDemoSite")} />

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

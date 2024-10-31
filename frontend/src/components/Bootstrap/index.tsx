import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
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
};

export default function Bootstrap() {
  const { showBoundary } = useErrorBoundary();
  const [_, setLocation] = useLocation();
  const [state, setState] = useState<State>({ isInProgress: true });
  const { formState: { errors }, handleSubmit, register, setError } = useForm<Form>({});

  async function submit(data: Form) {
    try {
      console.log(data);
      const response = await api.post("/bootstrap", data);
      const responseJson = await response.json();

      console.log(responseJson);
      if (response.ok) {

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

        if (response.ok) {
          setState((s) => ({ ...s, isInProgress: false }));
        } else {
          setLocation("/");
        }
      } catch (error) {
        showBoundary(error);
      }
    }

    run();
  }, []);

  console.log({ errors });
  console.log(!!errors.userPassword);

  return (
    <>
      <Title>Complete PoeticMetric installation</Title>

      {state.isInProgress ? (
        <div className="spinner-full">
          <div className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="container">
          <div>
            <h1>Welcome to PoeticMetric!</h1>

            <div>Complete PoeticMetric installation to continue.</div>
          </div>

          <div className={clsx("card", styles.card)}>
            <form className="card-body" onSubmit={handleSubmit(submit)}>
              <fieldset className="fieldset">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-user-name">Full name</label>

                  <input className="input" id="input-user-name" required {...register("userName")} />

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

                  <input className="input" required type="password" {...register("userPassword")} />

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

                  <input className="input" required {...register("organizationName")} />

                  {!!errors.organizationName ? (<div className="form-error">{errors.organizationName.message}</div>) : null}
                </div>

                <div className="form-group">
                  <div className="form-group-inline">
                    <input id="input-create-demo-site" type="checkbox" {...register("createDemoSite")} />

                    <label htmlFor="input-create-demo-site">Create demo site</label>
                  </div>

                  {!!errors.createDemoSite ? (<div className="form-error">{errors.createDemoSite.message}</div>) : null}
                </div>

                <button className="button button-blue" type="submit">Complete installation</button>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

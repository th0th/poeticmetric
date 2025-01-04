import clsx from "clsx";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Layout from "~/components/Layout";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  createDemoSite: boolean;
  organizationName: string;
  userEmail: string;
  userName: string;
  userPassword: string;
  userPassword2: string;
};

type State = {
  isComplete: boolean;
  isReady: boolean | null;
};

export default function Bootstrap() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isComplete: false, isReady: null });
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>();

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
          setErrors(setError, accessTokenResponseJson);
        }
        setState((prev) => ({ ...prev, isComplete: true }));
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
          setState((s) => ({ ...s, isReady: true }));
        } else if (response.status === 400) {
          setState((s) => ({ ...s, isReady: false }));
        } else {
          throw new Error("got an unexpected response");
        }
      } catch (error) {
        showBoundary(error);
      }
    }

    run().catch((error) => showBoundary(error));
  }, []);

  return (
    <>
      <Title>Complete PoeticMetric installation</Title>

      <Layout mainClassName="py-16">
        {state.isReady === null ? (
          <div className="align-items-center d-flex flex-grow-1 justify-content-center">
            <div className="spinner spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="container mw-32rem">
            <div className="text-center">
              <h1 className="fs-5_5 fw-bold text-primary-emphasis">Bootstrap</h1>

              {state.isReady ? (
                <>
                  <h2 className="display-5">
                    Welcome to
                    <br />
                    PoeticMetric!
                  </h2>

                  <div className="fs-5_5 text-body-emphasis">Complete PoeticMetric installation to continue.</div>
                </>
              ) : (
                <>
                  <h2 className="display-5">You are all set!</h2>

                  <div className="fs-5_5 text-body-emphasis">It looks like PoeticMetric has already been installed.</div>
                </>
              )}
            </div>

            {state.isReady ? (
              <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
                <ActivityOverlay isActive={isSubmitting} />

                <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
                  <div>
                    <label className="form-label" htmlFor="input-user-name">Full name</label>

                    <input
                      className={clsx("form-control", { "is-invalid": errors.userName })}
                      id="input-user-name"
                      required
                      {...register("userName")}
                    />

                    <div className="invalid-feedback">{errors.userName?.message}</div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                    <input
                      className={clsx("form-control", { "is-invalid": errors.userEmail })}
                      id="input-user-email"
                      required
                      type="email"
                      {...register("userEmail")}
                    />

                    <div className="invalid-feedback">{errors.userEmail?.message}</div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="input-user-password">New password</label>

                    <input
                      className={clsx("form-control", { "is-invalid": errors.userPassword })}
                      id="input-user-password"
                      required
                      type="password"
                      {...register("userPassword")}
                    />

                    <div className="invalid-feedback">{errors.userPassword?.message}</div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="input-user-password2">New password (again)</label>

                    <input
                      className={clsx("form-control", { "is-invalid": errors.userPassword2 })}
                      id="input-user-password2"
                      required
                      type="password"
                      {...register("userPassword2")}
                    />

                    <div className="invalid-feedback">{errors.userPassword2?.message}</div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="input-organization-name">Organization</label>

                    <input
                      className={clsx("form-control", { "is-invalid": errors.organizationName })}
                      id="input-organization-name"
                      required
                      {...register("organizationName")}
                    />

                    <div className="invalid-feedback">{errors.organizationName?.message}</div>
                  </div>

                  <div>
                    <div className="form-check">
                      <input
                        className={clsx("form-check-input", { "is-invalid": errors.createDemoSite })}
                        id="input-create-demo-site"
                        type="checkbox"
                        {...register("createDemoSite")}
                      />

                      <label className="form-check-label" htmlFor="input-create-demo-site">
                        Create demo site
                      </label>

                      <div className="invalid-feedback">{errors.createDemoSite?.message}</div>
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit">Complete installation</button>
                </fieldset>
              </form>
            ) : (
              <div className="text-center mt-8">
                <Link className="btn btn-primary" to="/">Return home</Link>
              </div>
            )}
          </div>
        )}
      </Layout>
    </>
  );
};

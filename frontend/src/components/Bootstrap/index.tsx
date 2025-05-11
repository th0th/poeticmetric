import { IconAlertTriangle } from "@tabler/icons-react";
import classNames from "classnames";
import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  createDemoSite: boolean;
  isAlreadyDone: boolean;
  organizationName: string;
  userEmail: string;
  userName: string;
  userPassword: string;
  userPassword2: string;
};

export default function Bootstrap() {
  const { refresh } = useAuthentication();
  const { showBoundary } = useErrorBoundary();
  const { formState: { errors, isLoading, isSubmitSuccessful, isSubmitting }, handleSubmit, register, setError, watch } = useForm<Form>({
    defaultValues: async () => {
      const values: Form = {
        createDemoSite: false,
        isAlreadyDone: false,
        organizationName: "",
        userEmail: "",
        userName: "",
        userPassword: "",
        userPassword2: "",
      };

      try {
        const response = await api.get("/bootstrap");

        if (response.status === 400) {
          values.isAlreadyDone = true;
        }
      } catch (e) {
        showBoundary(e);
      }

      return values;
    },
  });
  const isAlreadyDone = watch("isAlreadyDone");

  const title = useMemo(() => {
    if (isAlreadyDone) {
      return "You are all set!";
    } else if (isSubmitSuccessful) {
      return "Installation is complete";
    } else {
      return (
        <>
          Welcome to
          <br />
          PoeticMetric!
        </>
      );
    }
  }, [isAlreadyDone, isSubmitSuccessful]);

  const description = useMemo(() => {
    if (isAlreadyDone) {
      return "It looks like PoeticMetric has already been installed.";
    } else if (isSubmitSuccessful) {
      return "That's all folks!";
    } else {
      return "Complete PoeticMetric installation to continue.";
    }
  }, [isAlreadyDone, isSubmitSuccessful]);

  async function submit(data: Form) {
    try {
      const response = await api.post("/bootstrap", data);
      const responseJson = await response.json();

      if (response.ok) {
        const accessTokenResponse = await api.post("/authentication/user-access-tokens", undefined, {
          headers: {
            authorization: `basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
          },
        });

        const accessTokenResponseJson = await accessTokenResponse.json();

        if (accessTokenResponse.ok) {
          setUserAccessToken(accessTokenResponseJson.token);
          await refresh();
        } else {
          setErrors(setError, accessTokenResponseJson);
        }
      } else {
        setErrors(setError, responseJson);
      }
    } catch (e) {
      showBoundary(e);
    }
  }

  return (
    <>
      <Title>Complete PoeticMetric installation</Title>

      <div className="py-16">
        {isLoading ? (
          <div className="align-items-center d-flex flex-grow-1 justify-content-center">
            <div className="spinner spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="container mw-32rem">
            <div className="text-center">
              <h1 className="fs-5_5 fw-bold text-primary-emphasis">Bootstrap</h1>

              <h2 className="display-5">{title}</h2>

              <div className="fs-5_5 text-body-emphasis">{description}</div>
            </div>

            {isAlreadyDone ? (
              <div className="text-center mt-8">
                <Link className="btn btn-primary" to="/">Return home</Link>
              </div>
            ) : (
              <>
                {isSubmitSuccessful ? (
                  <div className="text-center mt-8">
                    <Link className="btn btn-primary" to="/sites">Go to app</Link>
                  </div>
                ) : (
                  <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
                    <ActivityOverlay isActive={isSubmitting} />

                    <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
                      {errors.root ? (
                        <div className="alert alert-danger align-items-center d-flex gap-6 mb-0 mt-16">
                          <IconAlertTriangle className="flex-grow-0 flex-shrink-0" />

                          {errors.root.message}
                        </div>
                      ) : null}

                      <div>
                        <label className="form-label" htmlFor="input-user-name">Full name</label>

                        <input
                          className={classNames("form-control", { "is-invalid": errors.userName })}
                          id="input-user-name"
                          required
                          {...register("userName")}
                        />

                        <div className="invalid-feedback">{errors.userName?.message}</div>
                      </div>

                      <div>
                        <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                        <input
                          className={classNames("form-control", { "is-invalid": errors.userEmail })}
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
                          className={classNames("form-control", { "is-invalid": errors.userPassword })}
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
                          className={classNames("form-control", { "is-invalid": errors.userPassword2 })}
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
                          className={classNames("form-control", { "is-invalid": errors.organizationName })}
                          id="input-organization-name"
                          required
                          {...register("organizationName")}
                        />

                        <div className="invalid-feedback">{errors.organizationName?.message}</div>
                      </div>

                      <div>
                        <div className="form-check">
                          <input
                            className={classNames("form-check-input", { "is-invalid": errors.createDemoSite })}
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
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export const Component = Bootstrap;

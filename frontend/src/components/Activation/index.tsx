import { IconAlertTriangle } from "@tabler/icons-react";
import classNames from "classnames";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  activationToken: string;
  name: string;
  newPassword: string;
  newPassword2: string;
};

export default function Activation() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams] = useSearchParams();
  const {
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<Form>({
    defaultValues: async () => {
      const values: Form = {
        activationToken: "",
        name: "",
        newPassword: "",
        newPassword2: "",
      };

      try {
        const activationToken = searchParams.get("t") || "";
        const response = await api.post("/authentication/activate-user", { activationToken });
        const responseJson = await response.json();

        if (responseJson.activationToken !== undefined) {
          setError("activationToken", { message: responseJson.activationToken });
        } else {
          values.activationToken = activationToken;
        }

        return values;
      } catch (e) {
        showBoundary(e);
      }

      return values;
    },
  });
  const activationToken = watch("activationToken");

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/activate-user", data);
      const responseJson = await response.json();

      if (!response.ok) {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Activation</Title>

      <div className="container mw-32rem py-16">
        <div className="text-center">
          <h1 className="fs-5_5 fw-bold text-primary-emphasis">Account activation</h1>

          <h2 className="display-5">{isSubmitSuccessful ? "Done!" : "Welcome!"}</h2>

          <div className="fs-5_5 text-body-emphasis">
            {isSubmitSuccessful
              ? "Your account is activated, please sign in."
              : "Set your account details, and password to accept the invitation sent by your organization."
            }
          </div>
        </div>

        <div className="mt-16">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner spinner-border text-primary" role="status" />
            </div>
          ) : (
            <>
              {activationToken === "" ? (
                <div className="alert alert-danger align-items-center d-flex gap-6 mb-0 mt-16">
                  <IconAlertTriangle className="flex-grow-0 flex-shrink-0" />

                  <div className="flex-grow-1">
                    This link is not valid, please request a new one from your organization&apos;s owner. If you continue to have problems,
                    please
                    {" "}
                    <a
                      className="alert-link"
                      href="mailto:support@poeticmetric.com?subject=I%20am%20having%20issues%20activating%20my%20account"
                      target="_blank"
                    >
                      contact support
                    </a>
                    .
                  </div>
                </div>
              ) : (
                <>
                  {isSubmitSuccessful ? (
                    <div className="align-items-center d-flex flex-column">
                      <Link className="btn btn-primary" to="/sign-in">Sign in</Link>
                    </div>
                    ) : (
                    <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
                      <ActivityOverlay isActive={isSubmitting} />

                      <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
                        <div>
                          <label className="form-label" htmlFor="input-name">Name</label>

                          <input
                            className={classNames("form-control", { "is-invalid": errors.name })}
                            id="input-name"
                            required
                            type="text"
                            {...register("name")}
                          />

                          <div className="invalid-feedback">{errors.newPassword?.message}</div>
                        </div>

                        <div>
                          <label className="form-label" htmlFor="input-new-password">New password</label>

                          <input
                            className={classNames("form-control", { "is-invalid": errors.newPassword })}
                            id="input-new-password"
                            required
                            type="password"
                            {...register("newPassword")}
                          />

                          <div className="invalid-feedback">{errors.newPassword?.message}</div>
                        </div>

                        <div>
                          <label className="form-label" htmlFor="input-new-password2">New password (again)</label>

                          <input
                            className={classNames("form-control", { "is-invalid": errors.newPassword2 })}
                            id="input-new-password2"
                            required
                            type="password"
                            {...register("newPassword2")}
                          />

                          <div className="invalid-feedback">{errors.newPassword2?.message}</div>
                        </div>

                        <button className="btn btn-primary" type="submit">Continue</button>
                      </fieldset>
                    </form>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

import { IconAlertTriangle } from "@tabler/icons-react";
import clsx from "clsx";
import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  passwordResetToken: string;
  userPassword: string;
  userPassword2: string;
};

export default function PasswordReset() {
  const { showBoundary } = useErrorBoundary();
  const search = useSearch();
  const { user } = useAuthentication();
  const {
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<Form>({
    defaultValues: async () => {
      const values: Form = {
        passwordResetToken: "",
        userPassword: "",
        userPassword2: "",
      };

      try {
        const passwordResetToken = new URLSearchParams(search).get("t") || "";
        const response = await api.post("/authentication/reset-user-password", { passwordResetToken });
        const responseJson = await response.json();

        if (responseJson.passwordResetToken !== undefined) {
          setError("passwordResetToken", { message: responseJson.passwordResetToken });
        } else {
          values.passwordResetToken = passwordResetToken;
        }

        return values;
      } catch (e) {
        showBoundary(e);
      }

      return values;
    },
  });
  const passwordResetToken = watch("passwordResetToken");

  const title = useMemo(() => {
    if (isSubmitSuccessful) {
      return "You are all set!";
    } else if (user !== null) {
      return "You are already in!";
    } else {
      return "Reset your password";
    }
  }, [isSubmitSuccessful, user]);

  const description = useMemo(() => {
    if (isSubmitSuccessful) {
      return "You successfully reset your password.";
    } else if (user !== null) {
      return "You can reset your password from user settings.";
    } else {
      return "Enter a new password to access your account.";
    }
  }, [isSubmitSuccessful, user]);

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/reset-user-password", data);
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
      <Title>Password reset</Title>

      <div className="container mw-32rem py-16">
        <div className="text-center">
          <h1 className="fs-5_5 fw-bold text-primary-emphasis">Password recovery</h1>
          <h2 className="display-5">{title}</h2>
          <div className="fs-5_5 text-body-emphasis">{description}</div>
        </div>

        <div className="mt-16">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner spinner-border text-primary" role="status" />
            </div>
          ) : null}
        </div>

        {passwordResetToken === "" ? (
          <div className="alert alert-danger align-items-center d-flex gap-6 mb-0 mt-16">
            <IconAlertTriangle className="flex-grow-0 flex-shrink-0" />

            <div className="flex-grow-1">
              This link is not valid, please request a new one. If you continue to have problems,
              please
              {" "}
              <a
                className="alert-link"
                href="mailto:support@poeticmetric.com?subject=I%20am%20having%20issues%20resetting%20my%20password"
                target="_blank"
              >
                contact support
              </a>
              .
            </div>
          </div>
        ) : (
          <>
            {isSubmitSuccessful ? null : (
              <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
                <ActivityOverlay isActive={isSubmitting} />

                <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
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

                  <button className="btn btn-primary" type="submit">Continue</button>
                </fieldset>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}

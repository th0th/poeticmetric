import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  currentPassword: string;
  newPassword: string;
  newPassword2: string;
};

type State = {
  isDone: boolean;
};

export default function Password() {
  const { showBoundary } = useErrorBoundary();
  const { user } = useAuthentication();
  const [state, setState] = useState<State>({ isDone: false });
  const { formState: { errors, isSubmitSuccessful, isSubmitting }, handleSubmit, register, reset, setError, watch } = useForm<Form>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPassword2: "",
    },
  });

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/change-user-password", {
        newPassword: data.newPassword,
        newPassword2: data.newPassword2,
      }, {
        headers: {
          authorization: `basic ${base64Encode(`${user?.email}:${data.currentPassword}`)}`,
        },
      });
      const responseJson = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("currentPassword", { message: "The current password is incorrect." });
        } else {
          setErrors(setError, responseJson);
        }

        return;
      }

      const accessTokenResponse = await api.post("/authentication/user-access-tokens", undefined, {
        headers: {
          authorization: `basic ${base64Encode(`${user?.email}:${data.newPassword}`)}`,
        },
      });

      if (!accessTokenResponse.ok) {
        throw new Error("An error occurred while signing in with the new password.");
      }

      const accessTokenResponseJson = await accessTokenResponse.json();
      setUserAccessToken(accessTokenResponseJson.token);
    } catch (e) {
      showBoundary(e);
    }
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      if (state.isDone) {
        setState((s) => ({ ...s, isDone: false }));
      }
    });

    return () => unsubscribe();
  }, [isSubmitSuccessful, state.isDone, watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setState((s) => ({ ...s, isDone: true }));
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <h2 className="fs-5">Password</h2>

      <form className="card" onSubmit={handleSubmit(submit)}>
        <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
          <div>
            <p>
              To change your password, please enter your current password and your new password below. Make sure your new password is strong
              and unique to keep your account secure.
            </p>

            {state.isDone ? (
              <div className="alert alert-success align-items-center d-flex gap-6 mb-0">
                <IconCircleCheck className="flex-grow-0 flex-shrink-0" />

                <div className="flex-grow-1">
                  Your password is successfully changed.
                </div>
              </div>
            ) : (
              <div className="alert alert-warning align-items-center d-flex gap-6 mb-0">
                <IconAlertTriangle className="flex-grow-0 flex-shrink-0" />

                <div className="flex-grow-1">
                  <span className="fw-semi-bold">Please note:</span>

                  {" "}
                  Updating your password will automatically sign you out of all other devices and sessions, except for the current one.
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="input-current-password">Current password</label>

            <input
              className={classNames("form-control", { "is-invalid": errors.currentPassword })}
              id="input-current-password"
              type="password"
              {...register("currentPassword")}
            />

            {errors.currentPassword ? (
              <div className="invalid-feedback">
                {errors.currentPassword.message}
              </div>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="input-new-password">New password</label>

            <input
              className="form-control"
              id="input-new-password"
              type="password"
              {...register("newPassword")}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="input-new-password2">New password (again)</label>

            <input
              className="form-control"
              id="input-new-password2"
              type="password"
              {...register("newPassword2")}
            />
          </div>

          <div>
            <button className="align-items-center btn btn-primary d-flex gap-4 justify-content-center" type="submit">
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" />
              ) : null}

              <span>Change my password</span>
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export const Component = Password;

import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { NewError } from "~/lib/errors";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  userEmail: string;
  userPassword: string;
};

export default function SignIn() {
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh, setState: setAuthenticationState } = useAuthentication();
  const { control, formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>();
  const userEmail = useWatch({ control, name: "userEmail" });

  const passwordRecoveryLink = useMemo(() => `/password-recovery${userEmail === ""
      ? ""
      : `?email=${encodeURIComponent(userEmail)}`}`,
    [userEmail],
  );

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/user-access-tokens", undefined, {
        headers: {
          authorization: `basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
        },
      });

      const responseJson = await response.json();

      if (response.ok) {
        setAuthenticationState((s) => ({ ...s, isNavigationInProgress: true }));
        setUserAccessToken(responseJson.token);
        await refresh();

        const nextFromSearchParams = searchParams.get("next");
        const next = nextFromSearchParams === null ? "/sites" : decodeURIComponent(nextFromSearchParams);
        navigate(next);
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(NewError(error));
    }
  }

  return (
    <>
      <Title>Sign in</Title>

      <div className="container mw-32rem py-16">
        <div className="text-center">
          <h1 className="fs-5_5 fw-bold text-primary-emphasis">Sign in</h1>

          <h2 className="display-5">Welcome back!</h2>

          <div className="fs-5_5 text-body-emphasis">Sign in to view your analytics dashboard.</div>
        </div>

        <div className="card mt-16 overflow-hidden position-relative">
          <div className="card-body">
            <ActivityOverlay isActive={isSubmitting} />

            <form onSubmit={handleSubmit(submit)}>
              <fieldset className="gap-12 vstack">
                {errors.root ? (
                  <div className="alert alert-danger mb-0">{errors.root.message}</div>
                ) : null}

                <div>
                  <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                  <input className="form-control" required type="email" {...register("userEmail")} />
                </div>

                <div>
                  <div className="align-items-end d-flex gap-2 mb-4">
                    <label className="form-label mb-0" htmlFor="input-user-password">Password</label>

                    <Link
                      className="fs-7 ms-auto text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                      /* eslint-disable-next-line jsx-a11y/tabindex-no-positive */
                      tabIndex={1}
                      to={passwordRecoveryLink}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input className="form-control" required type="password" {...register("userPassword")} />
                </div>

                <button className="btn btn-primary" type="submit">Sign in</button>
              </fieldset>
            </form>
          </div>

          <div className="card-footer fs-7 text-center">
            Don&apos;t have an account?
            {" "}
            <Link
              className="fw-medium text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
              to="/sign-up"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const Component = SignIn;

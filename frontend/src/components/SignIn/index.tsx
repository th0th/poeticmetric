import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useLocation, useSearch } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  userEmail: string;
  userPassword: string;
};

export default function SignIn() {
  const { showBoundary } = useErrorBoundary();
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const { user } = useAuthentication();
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError, watch } = useForm<Form>();
  const userEmail = watch("userEmail");

  const passwordRecoveryLink = useMemo(
    () => `/password-recovery${userEmail === "" ? "" : `?email=${encodeURIComponent(userEmail)}`}`,
    [userEmail],
  );

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/user-access-tokens", undefined, {
        headers: {
          authorization: `Basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
        },
      });

      const responseJson = await response.json();

      if (response.ok) {
        setUserAccessToken(responseJson.token);

        const next = new URLSearchParams(searchParams).get("next");

        navigate(next || "/sites");
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Sign in</Title>

      <div className="container mw-32rem py-16">
        <div className="text-center">
          <h1 className="fs-5_5 fw-bold text-primary-emphasis">Sign in</h1>

          <h2 className="display-5">{user === null ? "Welcome back!" : "Signed in!"}</h2>

          <div className="fs-5_5 text-body-emphasis">
            {user === null ? "Sign in to view your analytics dashboard." : "You seem to be signed in already."}
          </div>
        </div>

        {user === null ? (
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
                        href={passwordRecoveryLink}
                        tabIndex={1}
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
        ) : (
          <div className="d-flex justify-content-center mt-8">
            <Link className="btn btn-lg btn-primary" to="/sites">
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

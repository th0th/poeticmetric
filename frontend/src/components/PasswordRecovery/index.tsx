import classNames from "classnames";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import ActivityOverlay from "~/components/ActivityOverlay";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  email: string;
};

export default function PasswordRecovery() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams] = useSearchParams();
  const { formState: { errors, isSubmitSuccessful, isSubmitting }, handleSubmit, register, setError } = useForm<Form>({
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/send-user-password-recovery-email", data);
      const responseJson = await response.json();

      if (response.ok) {
      } else {
        setErrors(setError, responseJson);
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Title>Password recovery</Title>

      <div className="container mw-32rem py-16">
        <div className="text-center">
          <h1 className="fs-5_5 fw-bold text-primary-emphasis">Password recovery</h1>
          <h2 className="display-5">{isSubmitSuccessful ? "Check your inbox" : "Forgot password?"}</h2>
          <div className="fs-5_5 text-body-emphasis">
            {isSubmitSuccessful ? "If there is an account associated with the e-mail address you provided, you will receive a password recovery link. Check your inbox and follow the instructions." : "Enter your email address and we will send you a link to reset your password."}
          </div>
        </div>

        {isSubmitSuccessful ? null : (
          <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
            <ActivityOverlay isActive={isSubmitting} />

            <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
              <div>
                <label className="form-label" htmlFor="input-email">E-mail address</label>

                <input
                  className={classNames("form-control", { "is-invalid": errors.email })}
                  id="input-email"
                  required
                  type="email"
                  {...register("email")}
                />

                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>

              <button className="btn btn-primary" type="submit">Continue</button>
            </fieldset>

            <div className="card-footer fs-7 text-center">
              Remembered your password?
              {" "}
              <Link
                className="fw-medium text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                to="/sign-in"
              >
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

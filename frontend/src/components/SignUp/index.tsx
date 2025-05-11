import { IconAlertCircleFilled } from "@tabler/icons-react";
import classNames from "classnames";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Description from "~/components/Description";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import useCapture from "~/hooks/useCapture";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";
import { getBrowserTimeZone } from "~/lib/time-zone";
import { setUserAccessToken } from "~/lib/user-access-token";

type Form = {
  organizationName: string;
  organizationTimeZone: string;
  userEmail: string;
  userName: string;
  userPassword: string;
};

export default function SignUp() {
  const { showBoundary } = useErrorBoundary();
  const capture = useCapture();
  const { refresh } = useAuthentication();
  const navigate = useNavigate();
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Form>({
    defaultValues: {
      organizationTimeZone: getBrowserTimeZone() || "UTC",
    },
  });

  async function submit(data: Form) {
    try {
      const response = await api.post("/authentication/sign-up", data);
      const responseJson = await response.json();

      if (response.ok) {
        capture("signUp", { userEmail: data.userEmail });

        const createAccessTokenResponse = await api.post("/authentication/user-access-tokens", undefined, {
          headers: {
            authorization: `basic ${base64Encode(`${data.userEmail}:${data.userPassword}`)}`,
          },
        });
        const createAccessTokenResponseJson = await createAccessTokenResponse.json();

        setUserAccessToken(createAccessTokenResponseJson.token);
        await refresh();
        navigate(`/email-address-verification?next=${encodeURIComponent("/sites")}`);
      } else {
        setErrors(setError, responseJson);
      }
    } catch (e) {
      showBoundary(e);
    }
  }

  return (
    <>
      <Title>Sign up</Title>
      <Description>
        Join PoeticMetric today and start monitoring your website&apos;s uptime and performance. Sign up now to access reliable cron job and
        site monitoring services.
      </Description>

      <div className="container py-10">
        <div className="row">
          <div className="col-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
            <div className="text-center">
              <h1>Sign up</h1>

              <div className="mt-6">
                Create your PoeticMetric account. Start your
                {" "}
                <span className="fw-bold">14-day free trial, no credit card required.</span>
                {" "}
                Get the insights that matter most for your business, without the privacy headaches.
              </div>
            </div>

            <div className="card mt-12">
              <div className="card-body p-8">
                {errors.root !== undefined ? (
                  <div className="alert alert-danger align-items-center d-flex gap-3" role="alert">
                    <IconAlertCircleFilled className="flex-shrink-0" />

                    <div>{errors.root.message}</div>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit(submit)}>
                  <fieldset className="gap-12 vstack" disabled={isSubmitting}>
                    <div>
                      <label className="form-label" htmlFor="input-user-name">Full name</label>

                      <input
                        autoComplete="name"
                        className={classNames("form-control", errors.userName && "is-invalid")}
                        id="input-user-name"
                        required
                        {...register("userName", { required: true })}
                      />

                      {errors.userName !== undefined ? (
                        <div className="invalid-feedback">{errors.userName.message}</div>
                      ) : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="input-user-email">E-mail address</label>

                      <input
                        autoComplete="email"
                        className={classNames("form-control", errors.userEmail && "is-invalid")}
                        id="input-user-email"
                        required
                        type="email"
                        {...register("userEmail", { required: true })}
                      />

                      {errors.userEmail !== undefined ? (
                        <div className="invalid-feedback">{errors.userEmail.message}</div>
                      ) : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="input-user-password">Password</label>

                      <input
                        autoComplete="current-password"
                        className={classNames("form-control", errors.userPassword && "is-invalid")}
                        id="input-user-password"
                        required
                        type="password"
                        {...register("userPassword", { required: true })}
                      />

                      {errors.userPassword !== undefined ? (
                        <div className="invalid-feedback">{errors.userPassword.message}</div>
                      ) : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="input-organization-name">Company</label>

                      <input
                        autoComplete="organization"
                        className={classNames("form-control", errors.organizationName && "is-invalid")}
                        id="input-organization-name"
                        required
                        {...register("organizationName", { required: true })}
                      />

                      {errors.organizationName !== undefined ? (
                        <div className="invalid-feedback">{errors.organizationName.message}</div>
                      ) : null}
                    </div>

                    <div className="d-flex flex-column">
                      <button className="btn btn-primary" type="submit">
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />
                            {" "}
                          </>
                        ) : null}

                        Sign up
                      </button>
                    </div>
                  </fieldset>
                </form>

                <div className="mt-6 text-center fs-7">
                  Already have account?
                  {" "}
                  <Link className="text-decoration-none text-decoration-underline-hover" to="/sign-in">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


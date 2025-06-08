import { IconMailbox } from "@tabler/icons-react";
import classNames from "classnames";
import { OTPInput } from "input-otp";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import useCapture from "~/hooks/useCapture";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";
import styles from "./styles.module.scss";

type Form = {
  userEmailVerificationCode: string;
};

type ResendForm = {
  dummy: string;
};

const emailVerificationCodeLength = 4;

export default function EmailAddressVerification() {
  const [searchParams] = useSearchParams();
  const { refresh, user } = useAuthentication();
  const capture = useCapture();
  const form = useRef<HTMLFormElement>(null);
  const inputOTP = useRef<HTMLInputElement>(null);

  const {
    clearErrors,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm<Form>({
    defaultValues: async () => {
      const v: Form = {
        userEmailVerificationCode: "",
      };

      const emailVerificationCode = searchParams.get("c");
      if (emailVerificationCode !== null && emailVerificationCode.length === emailVerificationCodeLength) {
        v.userEmailVerificationCode = emailVerificationCode;
      }

      return v;
    },
  });

  const {
    formState: {
      errors: resendErrors,
      isSubmitSuccessful: isResendSubmitSuccessful,
      isSubmitting: isResendSubmitting,
    },
    handleSubmit: handleResendSubmit,
    setError: setResendError,
  } = useForm<ResendForm>();

  const emailVerificationCode = watch("userEmailVerificationCode");

  async function submit(data: Form) {
    const response = await api.post("/authentication/verify-user-email-address", data);
    const responseJson = await response.json();

    if (response.ok) {
      capture("userEmailVerified", { userEmail: user?.email });
      await refresh();
    } else {
      setErrors(setError, responseJson);
      inputOTP.current?.focus();
    }
  }

  async function submitResendForm() {
    const response = await api.post("/authentication/resend-user-email-address-verification-email");
    const responseJson = await response.json();

    if (response.ok) {

    } else {
      setErrors(setResendError, responseJson);
    }
  }

  return !user ? (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center p-8">
      <div className="spinner-border text-primary" />
    </div>
  ) : (
    <>
      <Title>Please verify your e-mail address to continue</Title>

      <div className="container mw-36rem py-24">
        <div className="align-items-center gap-4 vstack">
          <div className="align-items-center bg-primary d-flex flex-column justify-content-center p-10 rounded-circle size-6rem text-white">
            <IconMailbox size="100%" />
          </div>

          <div className="mt-10 text-center">
            {user.isEmailVerified || isSubmitSuccessful ? (
              <>
                <h1 className="fs-4">Your e-mail address is {!isSubmitSuccessful && user.isEmailVerified ? "already" : null} verified</h1>

                <div className="text-body-secondary">
                  You can continue to the application.
                </div>

                <Link className="btn btn-primary mt-8" to={searchParams.get("next") || "/sites"}>Go to application</Link>
              </>
            ) : (
              <>
                <h1 className="fs-4">Please verify your e-mail address to continue</h1>

                <div className="text-body-secondary">
                  <p>We have sent you an e-mail to verify your e-mail address. Please click the link in the e-mail, or enter the code
                    below.</p>

                  <p>Don&apos;t forget to check your spam folder if you can&apos;t find the e-mail in your inbox.</p>
                </div>

                <form className="mt-8" onSubmit={handleSubmit(submit)} ref={form}>
                  <fieldset className="gap-12 vstack" disabled={isSubmitting}>
                    {errors.root !== undefined ? (
                      <div className="alert alert-danger">
                        {errors.root.message}
                      </div>
                    ) : null}

                    <div>
                      <div
                        className={classNames(
                          "align-items-center d-flex flex-column",
                          { "is-invalid": errors.userEmailVerificationCode },
                        )}
                      >
                        <OTPInput
                          autoFocus
                          maxLength={emailVerificationCodeLength}
                          onChange={(v) => {
                            clearErrors();
                            setValue("userEmailVerificationCode", v);
                          }}
                          onComplete={() => form.current?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))}
                          ref={inputOTP}
                          render={({ slots }) => (
                            <div className="gap-4 hstack">
                              {slots.map((slot, idx) => (
                                <input
                                  className={classNames(
                                    "aspect-ratio-1 form-control fs-3 fw-medium mw-4rem px-0 text-center",
                                    { "border-primary": slot.hasFakeCaret },
                                    { "is-invalid": errors.userEmailVerificationCode },
                                    styles.input,
                                  )}
                                  key={idx} // eslint-disable-line react/no-array-index-key
                                  onChange={() => null}
                                  tabIndex={-1}
                                  value={slot.char || ""}
                                />
                              ))}
                            </div>
                          )}
                          required
                          value={emailVerificationCode}
                        />
                      </div>

                      <div className="invalid-feedback text-center">{errors.userEmailVerificationCode?.message}</div>
                    </div>

                    <div className="align-items-center gap-2 vstack">
                      <button className="btn btn-primary" type="submit">Continue</button>

                      {resendErrors.root !== undefined ? (
                        <div className="alert alert-danger mb-0 mt-4">
                          {resendErrors.root.message}
                        </div>
                      ) : null}

                      {isResendSubmitSuccessful ? (
                        <div className="alert alert-success mt-4">A new e-mail is sent, please check your inbox.</div>
                      ) : (
                        <button
                          className="btn btn-link"
                          disabled={isResendSubmitting || isResendSubmitSuccessful}
                          onClick={handleResendSubmit(submitResendForm)}
                          type="button"
                        >
                          Request a new code
                        </button>
                      )}
                    </div>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const Component = EmailAddressVerification;

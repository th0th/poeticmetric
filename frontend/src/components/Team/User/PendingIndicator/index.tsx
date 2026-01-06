import { IconCheck, IconExclamationCircle, IconHourglass } from "@tabler/icons-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";
import { setErrors } from "~/lib/form";

type Form = {
  userID: number;
};

export type PendingIndicatorProps = {
  userID: number;
};

export default function PendingIndicator({ userID }: PendingIndicatorProps) {
  const { showBoundary } = useErrorBoundary();
  const {
    formState: { isSubmitSuccessful, isSubmitted, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<Form>({ defaultValues: { userID } });

  async function submit(data: Form) {
    try {
      const response = await api.post("/users/resend-invitation-email", data);

      if (!response.ok) {
        const responseJSON = await response.json();
        setErrors(setError, responseJSON);
      }
    } catch (error) {
      showBoundary(NewError(error));
    }
  }

  return (
    <OverlayTrigger
      overlay={(
        <Tooltip className="fw-medium">
          <div className="d-flex flex-column gap-4">
            The invitation is pending.

            {isSubmitted ? (
              <div className="fs-8">
                {isSubmitSuccessful ? (
                  <>
                    <IconCheck size="1.2em" />
                    {" An e-mail is sent!"}
                  </>
                ) : (
                  <>
                    <IconExclamationCircle size="1.2em" />
                    {" An error occurred."}
                  </>
                )}
              </div>
            ) : (
              <button
                className="align-items-center btn btn-primary btn-sm d-flex gap-4 justify-content-center"
                disabled={isSubmitting}
                onClick={handleSubmit(submit)}
                type="button"
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : null}

                Resend e-mail
              </button>
            )}
          </div>
        </Tooltip>
      )}
      placement="bottom"
      rootClose
      trigger="click"
    >
      <button
        className="align-items-center bg-warning bottom-0 btn-unstyled d-flex end-0 justify-content-center position-absolute rounded-circle size-2rem text-inverted z-2"
        type="button"
      >
        <IconHourglass size="1.25em" />
      </button>
    </OverlayTrigger>
  );
}

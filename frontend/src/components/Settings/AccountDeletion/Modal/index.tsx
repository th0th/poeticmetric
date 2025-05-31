import { IconAlertTriangle } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Modal as BsModal, ModalProps } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Portal from "~/components/Portal";
import useAuthentication from "~/hooks/useAuthentication";
import { api } from "~/lib/api";
import { base64Encode } from "~/lib/base64";
import { setErrors } from "~/lib/form";

type State = {
  isReady: boolean;
  reasons: Array<OrganizationDeletionReason>;
  selectedReason: OrganizationDeletionReason | null;
};

type Form = {
  detail: string;
  password: string;
  reason: string;
};

export default function Modal({ ...props }: ModalProps) {
  const [state, setState] = useState<State>({ isReady: false, reasons: [], selectedReason: null });
  const navigate = useNavigate();
  const { signOut, user } = useAuthentication();
  const { formState: { errors }, handleSubmit, register, setError, watch } = useForm<Form>();
  const reason = watch("reason");

  async function submit(data: Form) {
    const response = await api.delete("/organization", data, {
      headers: {
        authorization: `basic ${base64Encode(`${user?.email}:${data.password}`)}`,
      },
    });

    if (response.ok) {
      props.onHide?.();
      navigate("/", { replace: true });
      signOut();
    } else if (response.status === 401) {
      setError("password", { message: "The password is incorrect." });
    } else {
      const responseJson = await response.json();

      setErrors(setError, responseJson);
    }
  }

  useEffect(() => {
    async function getOptions() {
      const response = await api.get("/organization/deletion-options");
      const responseJson = await response.json();

      setState((s) => ({ ...s, isReady: true, reasons: responseJson.reasons }));
    }

    getOptions().catch((e) => {throw e;});
  }, []);

  useEffect(() => {
    setState((s) => ({ ...s, selectedReason: s.reasons.find((r) => r.reason === reason) || null }));
  }, [reason]);

  return (
    <Portal>
      <BsModal {...props}>
        <BsModal.Header closeButton>
          <BsModal.Title>Account deletion</BsModal.Title>
        </BsModal.Header>

        <BsModal.Body>
          <div className="alert alert-danger align-items-center d-flex flex-row gap-6">
            <IconAlertTriangle className="flex-shrink-0" />

            <span>
              This action cannot be undone. This will permanently delete the PoeticMetric organization, and all the associated data
              irreversibly.
            </span>
          </div>

          <form onSubmit={handleSubmit(submit)}>
            <fieldset className="gap-12 vstack">
              <div>
                <label className="form-label" htmlFor="reason">Before we wave you goodbye, why are you deleting your account?</label>

                <div className="gap-4 vstack">
                  {state.reasons.map((reason) => (
                    <div className="form-check" key={reason.order}>
                      <input
                        className={classNames("form-check-input", { "is-invalid": errors.reason })}
                        id={`input-reason-${reason.order}`}
                        required
                        type="radio"
                        value={reason.reason}
                        {...register("reason")}
                      />

                      <label className="form-check-label" htmlFor={`input-reason-${reason.order}`}>
                        {reason.reason}
                      </label>
                    </div>
                  ))}

                  <div className={classNames("invalid-feedback", { "d-block": true })}>{errors.reason?.message}</div>
                </div>
              </div>

              <div className={classNames({ "d-none": !state.selectedReason?.detailTitle })}>
                <label className="form-label" htmlFor="input-detail">{state.selectedReason?.detailTitle}</label>

                <textarea
                  className="form-control"
                  id="input-detail"
                  required={!!state.selectedReason?.detailTitle}
                  rows={4}
                  {...register("detail")}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="input-password">Password</label>

                <input
                  className={classNames("form-control", { "is-invalid": errors.password })}
                  id="input-password"
                  required
                  type="password"
                  {...register("password")}
                />

                <div className="invalid-feedback">{errors.password?.message}</div>
              </div>

              <button className="btn btn-danger" type="submit">I understand the consequences, delete my account</button>

              <button className="btn btn-primary" onClick={props.onHide} type="button">Cancel and go back</button>
            </fieldset>
          </form>
        </BsModal.Body>
      </BsModal>
    </Portal>
  );
}

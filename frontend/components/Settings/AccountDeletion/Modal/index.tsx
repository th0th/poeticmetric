import { omit, pick } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Alert, Button, Form, FormGroup, Modal as BsModal, ModalProps, Stack } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../../contexts";
import { api, base64Encode } from "../../../../helpers";
import { useForm } from "../../../../hooks";

type Form = {
  details: string | null;
  password: string;
  reason: string;
};

type Reason = {
  detailsLabel?: string;
  text: string;
};

type State = {
  isDisabled: boolean;
};

const initialValues: Form = { details: null, password: "", reason: "" };

const reasons: Reason[] = [
  {
    detailsLabel: "What is missing?",
    text: "The service didn't meet my requirements.",
  },
  {
    text: "I can't afford the service.",
  },
  {
    detailsLabel: "Who are you leaving us for? :(",
    text: "I started using another monitoring app.",
  },
  {
    detailsLabel: "What is it that didn't work for you?",
    text: "I experienced some problems (bugs, incorrect stats).",
  },
  {
    text: "I had issues adding PoeticMetric to my site.",
  },
  {
    text: "It is too complex to use PoeticMetric.",
  },
  {
    detailsLabel: "What did go wrong?",
    text: "Other.",
  },
];

export function Modal() {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ isDisabled: false });
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialValues);

  const isShown = useMemo<boolean>(() => router.query.action === "account-deletion", [router.query.action]);

  const reason = useMemo<Reason | null>(() => {
    return reasons.find((r) => r.text === values.reason) || null;
  }, [values.reason]);

  const handleExit = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [setErrors, setValues]);

  const handleHide = useCallback<Exclude<ModalProps["onHide"], undefined>>(async () => {
    await router.push({ pathname: router.pathname, query: omit(router.query, ["action"]) });
  }, [router]);

  const handleReasonRadioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, reasonText: Reason["text"]) => {
    if (event.target.checked) {
      const r = reasons.find((r) => r.text === reasonText);

      if (r !== undefined) {
        setValues((v) => ({ ...v, details: r.detailsLabel !== undefined ? "" : null, reason: r.text }));
      }
    }
  }, [setValues]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    if (user === null) {
      return;
    }

    const payload = pick(values, ["details", "reason"]);

    const response = await api.delete("/organization", payload, {
      headers: {
        authorization: `basic ${base64Encode(`${user.email}:${values.password}`)}`,
      },
    });

    if (response.ok) {
      addToast({ body: "Your account, and all the associated data are deleted. Farewell!", variant: "success" });

      await router.push("/sign-out");

      return;
    } else if (response.status === 401) {
      setErrors({ password: "Incorrect password." });
    } else {
      const responseJson = await response.json();

      setErrors(responseJson);
    }

    setState((s) => ({ ...s, isDisabled: false }));
  }, [addToast, router, setErrors, user, values]);

  return (
    <BsModal
      onExited={handleExit}
      onHide={handleHide}
      show={isShown}
    >
      <BsModal.Header closeButton>
        <BsModal.Title>Account deletion</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Alert className="align-items-center d-flex flex-row fs-sm py-2" variant="danger">
          <i className="bi bi-info-circle flex-shrink-0 fs-3" />

          <div className="flex-grow-1 ms-2">
            This action cannot be undone. This will permanently delete the PoeticMetric organization, and all the associated data.
          </div>
        </Alert>

        <Form onSubmit={handleSubmit}>
          <fieldset disabled={state.isDisabled}>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Before we wave you goodbye, why are you deleting your account?</Form.Label>

                <div className={errors.reason !== undefined ? "is-invalid" : ""}>
                  {reasons.map((r) => (
                    <div className="py-1" key={r.text}>
                      <Form.Check
                        checked={values.reason === r.text}
                        className="fw-medium"
                        id={`account-deletion-form.reason-${r.text}`}
                        isInvalid={errors.reason !== undefined}
                        label={r.text}
                        name="reason"
                        onChange={(event) => handleReasonRadioChange(event, r.text)}
                        required
                        type="radio"
                      />
                    </div>
                  ))}
                </div>

                <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
              </Form.Group>

              {reason !== null && values.details !== null ? (
                <Form.Group controlId="account-deletion-form.details">
                  <Form.Label>{reason.detailsLabel}</Form.Label>

                  <Form.Control
                    as="textarea"
                    isInvalid={errors.details !== undefined}
                    name="details"
                    onChange={updateValue}
                    required
                    value={values.details}
                  />

                  <Form.Control.Feedback type="invalid">{errors.details}</Form.Control.Feedback>
                </Form.Group>
              ) : null}

              <FormGroup controlId="accountDeletionForm.password">
                <Form.Label>Password</Form.Label>

                <Form.Control isInvalid={errors.password !== undefined} name="password" onChange={updateValue} required type="password" />

                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </FormGroup>

              <Stack gap={2}>
                <Button type="submit" variant="danger">I understand the consequences, delete my account</Button>

                <Button onClick={handleHide} type="button" variant="outline-primary">Cancel and go back</Button>
              </Stack>
            </Stack>
          </fieldset>
        </Form>
      </BsModal.Body>
    </BsModal>
  );
}

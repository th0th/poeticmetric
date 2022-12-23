import Link from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Form, InputGroup, Stack } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../contexts";
import { useForm } from "../../../hooks";

type Form = {
  name: string;
};

type State = {
  isDisabled: boolean;
};

export function OrganizationDetails() {
  const { api, organization } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  const [state, setState] = useState<State>({ isDisabled: false });
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({ name: "" });

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = await api.patch("/organization", values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({ body: "Organization details updated.", variant: "success" });
    } else {
      setErrors(responseJson);
    }

    setState((s) => ({ ...s, isDisabled: false }));
  }, [addToast, api, setErrors, values]);

  useEffect(() => {
    if (organization !== null) {
      setValues((s) => ({ ...s, name: organization.name }));
    }
  }, [organization, setValues]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Organization details</Card.Title>

        <p>
          Organization details are used only for displaying your organization&apos;s name on the website, it doesn&apos;t affect any other
          functionality.
        </p>

        <Alert className="align-items-center d-flex flex-row fs-sm my-3 py-2" variant="warning">
          <span className="bi-info-circle flex-shrink-0 fs-3" />

          <div className="flex-grow-1 ms-2">
            If you need to change company details for invoices and receipts, please go to the

            {" "}

            <Alert.Link as={Link} href="/billing">
              billing section
            </Alert.Link>
            .
          </div>
        </Alert>

        <Form onSubmit={handleSubmit}>
          <fieldset disabled={state.isDisabled}>
            <Stack gap={4}>
              <Form.Group controlId="form-group-name">
                <Form.Label>Name</Form.Label>

                <InputGroup hasValidation>
                  <Form.Control
                    isInvalid={errors.name !== undefined}
                    maxLength={70}
                    minLength={2}
                    name="name"
                    onChange={updateValue}
                    required
                    value={values.name}
                  />

                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <div>
                <Button type="submit">Save changes</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}

import { omit } from "lodash";
import React, { useCallback, useContext, useId, useState } from "react";
import { Alert, Button, Card, Form, Stack } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../contexts";
import { base64Encode } from "../../../helpers";
import { useForm } from "../../../hooks";

type Form = {
  newPassword: string;
  newPassword2: string;
  password: string;
};

type State = {
  isDisabled: boolean;
};

const initialForm: Form = { newPassword: "", newPassword2: "", password: "" };

export function Password() {
  const { api, setUserAccessToken, user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ isDisabled: false });
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = await api.post("/users/change-password", omit(values, ["password"]), {
      headers: {
        authorization: `basic ${base64Encode(`${user?.email}:${values.password}`)}`,
      },
    });
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.userAccessToken.token);

      setValues(initialForm);

      addToast({ body: "Your password has been changed.", variant: "success" });
    } else {
      if (response.status === 401) {
        setErrors({ password: "Incorrect password." });
      } else {
        setErrors(responseJson);
      }
    }

    setState((s) => ({ ...s, isDisabled: false }));
  }, [addToast, api, setErrors, setUserAccessToken, setValues, user?.email, values]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Password</Card.Title>

        <div>
          To change your password, please type in your current password, and your new password twice.
        </div>

        <Alert className="align-items-center d-flex flex-row fs-sm my-3 py-2" variant="warning">
          <span className="bi-info-circle flex-shrink-0 fs-3" />

          <div className="flex-grow-1 ms-2">
            Changing your password will sign you out from all other devices and sessions (except this one).
          </div>
        </Alert>

        <Form onSubmit={handleSubmit}>
          <fieldset disabled={state.isDisabled}>
            <Stack gap={3}>
              <Form.Group controlId={useId()}>
                <Form.Label>Current password</Form.Label>

                <Form.Control
                  isInvalid={errors.password !== undefined}
                  name="password"
                  onChange={updateValue}
                  type="password"
                  value={values.password}
                />

                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId={useId()}>
                <Form.Label>New password</Form.Label>

                <Form.Control
                  isInvalid={errors.newPassword !== undefined}
                  name="newPassword"
                  onChange={updateValue}
                  type="password"
                  value={values.newPassword}
                />

                <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId={useId()}>
                <Form.Label>New password (again)</Form.Label>

                <Form.Control
                  isInvalid={errors.newPassword2 !== undefined}
                  name="newPassword2"
                  onChange={updateValue}
                  type="password"
                  value={values.newPassword2}
                />

                <Form.Control.Feedback type="invalid">{errors.newPassword2}</Form.Control.Feedback>
              </Form.Group>

              <div>
                <Button type="submit">Change password</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}

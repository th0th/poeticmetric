import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Card, Form, OverlayTrigger, Popover, Stack } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../contexts";
import { api } from "../../../helpers";
import { useForm } from "../../../hooks";
import { Avatar } from "../../Avatar";

type Form = {
  email: string;
  name: string;
};

type State = {
  isDisabled: boolean;
};

export function Profile() {
  const { user } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  const [state, setState] = useState<State>({ isDisabled: false });
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({ email: "", name: "" });

  const gravatarNoticeNode = useMemo(() => (
    <Popover>
      <Popover.Body>
        <p>
          {"PoeticMetric uses "}
          <span className="fw-bold">Gravatar</span>
          {" for fetching profile pictures."}
        </p>

        <div>
          <a className="fw-semibold" href="https://gravatar.com/connect/" rel="noreferrer" target="_blank">
            Click here to update your Gravatar.
          </a>
        </div>
      </Popover.Body>
    </Popover>
  ), []);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = await api.patch("/users/me", values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({ body: "Your profile is updated.", variant: "success" });
    } else {
      setErrors(responseJson);
    }

    setState((s) => ({ ...s, isDisabled: false }));
  }, [addToast, setErrors, values]);

  useEffect(() => {
    if (user !== null) {
      setValues((s) => ({ ...s, email: user.email, name: user.name }));
    }
  }, [setValues, user]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Personal details</Card.Title>

        <Form onSubmit={handleSubmit}>
          <fieldset disabled={state.isDisabled}>
            <Stack gap={4}>
              <div className="align-items-center d-flex flex-column mb-2">
                <OverlayTrigger overlay={gravatarNoticeNode} placement="auto" rootClose trigger="click">
                  <div className="cursor-pointer">
                    <Avatar alt={`Avatar for ${values.email}`} email={values.email} size={128} />
                  </div>
                </OverlayTrigger>
              </div>

              <Form.Group controlId="form-group-email">
                <Form.Label>E-mail address</Form.Label>

                <Form.Control disabled name="email" readOnly value={values.email} />
              </Form.Group>

              <Form.Group controlId="form-group-name">
                <Form.Label>Name</Form.Label>

                <Form.Control
                  isInvalid={errors.name !== undefined}
                  maxLength={70}
                  minLength={1}
                  name="name"
                  onChange={updateValue}
                  required
                  value={values.name}
                />

                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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

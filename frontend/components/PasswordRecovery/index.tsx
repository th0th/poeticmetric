import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Layout, Title } from "..";
import { api } from "../../helpers";
import { useForm } from "../../hooks";

type Form = {
  email: string;
};

type State = {
  isDisabled: boolean;
  isDone: boolean;
};

export function PasswordRecovery() {
  const router = useRouter();
  const [state, setState] = useState<State>({ isDisabled: false, isDone: false });
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ email: "" });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = await api.post("/users/password-recovery", values);
    const responseJson = await response.json();

    if (response.ok) {
      setState((s) => ({ ...s, isDone: true }));
    } else {
      setErrors(responseJson);
      setState((s) => ({ ...s, isDisabled: false }));
    }
  }, [setErrors, values]);

  useEffect(() => {
    if (router.query.email !== undefined) {
      updateValue("email", router.query.email);
    }
  }, [router.query.email, updateValue]);

  return (
    <Layout kind="app">
      <Title>Recover your password</Title>

      <Container className="py-5">
        <div className="mx-auto mw-32rem text-center">
          <h1>Recovery your password</h1>

          <div className="mt-3">
            <p>Enter your e-mail address and we will send you an e-mail with the instructions to reset your password.</p>

            <p>
              {"Remembered you password? "}

              <Link href="/sign-in">Sign in</Link>
            </p>
          </div>
        </div>

        <Card className="mt-4 mx-auto mw-32rem">
          <Card.Body>
            {state.isDone ? (
              <Alert className="mb-0" variant="success">Please check your inbox.</Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <fieldset disabled={state.isDisabled}>
                  <Form.Group>
                    <Form.Label>E-mail address</Form.Label>

                    <Form.Control
                      isInvalid={errors.email !== undefined}
                      name="email"
                      onChange={updateValue}
                      required
                      type="email"
                      value={values.email}
                    />

                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button type="submit" variant="primary">Continue</Button>
                  </div>
                </fieldset>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Layout, Title } from "..";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { api } from "../../helpers";
import { useForm } from "../../hooks";

type Form = {
  newPassword: string;
  newPassword2: string;
};

type State = {
  isDisabled: boolean;
  isReady: boolean;
};

export function PasswordReset() {
  const router = useRouter();
  const { setUserAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ isDisabled: false, isReady: false });
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ newPassword: "", newPassword2: "" });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = await api.post("/users/password-reset", { ...values, passwordResetToken: router.query.t });
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.userAccessToken.token);

      addToast({ body: "Your password is successfully reset. Now signing you in...", variant: "success" });
    } else {
      setErrors(responseJson);
      setState((s) => ({ ...s, isDisabled: false }));
    }
  }, [addToast, router.query.t, setErrors, setUserAccessToken, values]);

  const validatePasswordResetToken = useCallback(async () => {
    const response = await api.post("/users/password-reset", { passwordResetToken: router.query.t });
    const responseJson = await response.json();

    if (responseJson.passwordResetToken !== undefined) {
      addToast({
        body: (
          <>
            {"This link is not valid. Please contact "}
            <a className="text-white" href="mailto:support@poeticmetric.com">support</a>
            {" if you need help."}
          </>
        ),
        variant: "danger",
      });

      await router.replace("/");
    }
  }, [addToast, router]);

  useEffect(() => {
    if (router.isReady && !state.isReady) {
      validatePasswordResetToken();

      setState((s) => ({ ...s, isReady: true }));
    }
  }, [router.isReady, state.isReady, validatePasswordResetToken]);

  return (
    <Layout kind="app">
      <Title>Reset your password</Title>

      <Container className="py-5">
        <div className="mx-auto mw-32rem text-center">
          <h1>Reset your password</h1>
        </div>

        <Card className="mt-4 mx-auto mw-32rem">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <fieldset disabled={state.isDisabled}>
                <Form.Group>
                  <Form.Label>New password</Form.Label>

                  <Form.Control
                    isInvalid={errors.newPassword !== undefined}
                    maxLength={128}
                    minLength={8}
                    name="newPassword"
                    onChange={updateValue}
                    required
                    type="password"
                    value={values.newPassword}
                  />

                  <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>New password (again)</Form.Label>

                  <Form.Control
                    isInvalid={errors.newPassword2 !== undefined}
                    maxLength={128}
                    minLength={8}
                    name="newPassword2"
                    onChange={updateValue}
                    required
                    type="password"
                    value={values.newPassword2}
                  />

                  <Form.Control.Feedback type="invalid">{errors.newPassword2}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button type="submit" variant="primary">Reset password</Button>
                </div>
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

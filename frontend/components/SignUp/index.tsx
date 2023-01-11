import Link from "next/link";
import React, { useCallback, useContext } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Layout, Title } from "..";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { api } from "../../helpers";
import { useForm } from "../../hooks";

type Form = {
  email: string;
  name: string;
  organizationName: string;
  password: string;
};

export function SignUp() {
  const { setUserAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  const [values, , updateValue, errors, setErrors] = useForm<Form>({ email: "", name: "", organizationName: "", password: "" });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();

    const response = await api.post("/users/sign-up", values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({
        body: "Welcome to PoeticMetric! Your account has been created successfully. Check your e-mail to verify and activate your account.",
        variant: "success",
      });

      setUserAccessToken(responseJson.userAccessToken.token);
    } else {
      setErrors(responseJson);
    }
  }, [addToast, setErrors, setUserAccessToken, values]);

  return (
    <Layout kind="app">
      <Title>Sign up</Title>

      <Container className="py-5">
        <div className="text-center">
          <h1 className="fw-bold">Sign up</h1>

          <div className="mt-3">
            {"Already have an account? "}

            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>

        <Card className="mt-4 mx-auto mw-32rem">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Full name</Form.Label>

                <Form.Control
                  isInvalid={errors.name !== undefined}
                  maxLength={70}
                  minLength={1}
                  name="name"
                  onChange={updateValue}
                  required
                  type="text"
                  value={values.name}
                />

                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
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

              <Form.Group className="mt-3">
                <Form.Label>Password</Form.Label>

                <Form.Control
                  isInvalid={errors.password !== undefined}
                  maxLength={128}
                  minLength={8}
                  name="password"
                  onChange={updateValue}
                  required
                  type="password"
                  value={values.password}
                />

                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Company name</Form.Label>

                <Form.Control
                  isInvalid={errors.organizationName !== undefined}
                  maxLength={70}
                  minLength={1}
                  name="organizationName"
                  onChange={updateValue}
                  required
                  type="text"
                  value={values.organizationName}
                />

                <Form.Control.Feedback type="invalid">{errors.organizationName}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" variant="primary">Sign up</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useContext, useMemo } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Layout } from "../../components";
import { AuthAndApiContext } from "../../contexts";
import { api, base64Encode } from "../../helpers";
import { useForm } from "../../hooks";

type Form = {
  email: string,
  password: string,
};

export function SignIn() {
  const { setUserAccessToken } = useContext(AuthAndApiContext);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ email: "", password: "" });

  const errorNode = useMemo(() => (errors.detail !== undefined ? (
    <Alert variant="danger">
      {errors.detail}
    </Alert>
  ) : null), [errors.detail]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();

    const response = await api.post("/user-access-tokens", {}, {
      headers: {
        authorization: `basic ${base64Encode(`${values.email}:${values.password}`)}`,
      },
    });
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.token);
    } else {
      setErrors(responseJson);
    }
  }, [setErrors, setUserAccessToken, values.email, values.password]);

  return (
    <Layout>
      <Head>
        <title>Sign in</title>
      </Head>

      <Container className="py-5">
        <div className="text-center">
          <h1 className="fw-bold">Sign in to continue</h1>

          <div className="mt-3">
            {"Don't have an account? "}

            <Link href="/sign-up">Sign up</Link>
          </div>
        </div>

        <Card className="mt-4 mx-auto mw-32rem">
          <Card.Body>
            {errorNode}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mt-3">
                <Form.Label>E-mail address</Form.Label>
                <Form.Control isInvalid={!!errors.email} name="email" onChange={updateValue} type="email" value={values.email} />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  isInvalid={!!errors.password}
                  name="password"
                  onChange={updateValue}
                  type="password"
                  value={values.password}
                />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button className="fw-semibold" type="submit" variant="primary">Sign in</Button>
              </div>

              <div className="align-items-center d-flex flex-column mt-2">
                <Link className="fw-semibold" href="/password-recovery">
                  <small>Forgot password?</small>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Breadcrumb, Layout, Title } from "..";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { useForm, useQueryNumber, useSwrMatchMutate } from "../../hooks";

type Form = {
  email: string;
  name: string;
};

type State = {
  isDisabled: boolean;
  isReady: boolean | null;
};

export function TeamMemberForm() {
  const router = useRouter();
  const swrMatchMutate = useSwrMatchMutate();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const id = useQueryNumber("id");
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({ email: "", name: "" });
  const [state, setState] = useState<State>({ isDisabled: false, isReady: null });

  const buttonTitle = useMemo<string>(() => (id === undefined ? "Invite team member" : "Save team member"), [id]);

  const title = useMemo<string>(() => (id === undefined ? "Invite new team member" : "Edit team member"), [id]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    setState((s) => ({ ...s, isDisabled: true }));

    const response = id === undefined ?
      await api.post("/users", values) :
      await api.patch(`/users/${id}`, values);

    const responseJson = await response.json();

    if (response.ok) {
      addToast({
        body: id === undefined ? "Invitation e-mail is sent." : "Team member is updated.",
        variant: "success",
      });

      await swrMatchMutate("/users");

      await router.push("/team");
    } else {
      setState((s) => ({ ...s, isDisabled: false }));

      setErrors(responseJson);
    }
  }, [addToast, api, id, router, setErrors, swrMatchMutate, values]);

  const read = useCallback(async () => {
    if (id === undefined) {
      return;
    }

    const response = await api.get(`/users/${id}`);
    const responseJson = await response.json();

    if (!response.ok) {
      addToast({ body: responseJson?.detail || "An error has occurred.", variant: "danger" });
      await router.replace("/team");

      return;
    }

    setValues((v) => ({ ...v, email: responseJson.email, name: responseJson.name }));

    setState((s) => ({ ...s, isReady: true }));
  }, [addToast, api, id, router, setValues]);

  useEffect(() => {
    if (router.isReady && state.isReady === null) {
      if (id === undefined) {
        setState((s) => ({ ...s, isReady: true }));
      } else {
        setState((s) => ({ ...s, isReady: false }));

        read();
      }
    }
  }, [id, read, router.isReady, state.isReady]);

  return (
    <Layout kind="app">
      <Title>{title}</Title>

      {state.isReady ? (
        <Container className="py-5">
          <Breadcrumb items={[{ href: "/team", title: "Team" }]} title={title} />

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <fieldset className="vstack gap-3" disabled={state.isDisabled}>
                  <Form.Group controlId="form-name">
                    <Form.Label>Name</Form.Label>

                    <Form.Control
                      isInvalid={errors.name !== undefined}
                      maxLength={70}
                      minLength={1}
                      name="name"
                      onChange={updateValue}
                      value={values.name}
                    />

                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="form-email">
                    <Form.Label>E-mail address</Form.Label>

                    <Form.Control
                      disabled={id !== undefined}
                      isInvalid={errors.email !== undefined}
                      name="email"
                      onChange={updateValue}
                      type="email"
                      value={values.email}
                    />

                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="mt-2">
                    <Button type="submit">{buttonTitle}</Button>
                  </div>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      ) : (
        <div className="align-items-center d-flex flex-column flex-grow-1 justify-content-center p-3">
          <Spinner variant="primary" />
        </div>
      )}
    </Layout>
  );
}

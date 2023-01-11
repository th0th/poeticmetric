import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Breadcrumb, Button, Card, Container, Form } from "react-bootstrap";
import { Layout } from "../../components";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { useForm, useQueryNumber } from "../../hooks";

type State = {
  isDisabled: boolean;
};

type Form = {
  domain: string;
  name: string;
};

export function SiteForm() {
  const router = useRouter();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({ domain: "", name: "" });
  const id = useQueryNumber("id");
  const [state, setState] = useState<State>({ isDisabled: false });
  const title = useMemo(() => (id === undefined ? "Add site" : "Edit site"), [id]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    const response = id === undefined
      ? await api.post("/sites", values)
      : await api.patch(`/sites/${id}`, values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({
        body: id === undefined ? "Site is created." : "Site is updated.",
        variant: "success",
      });

      await router.push("/sites");
    } else {
      setErrors(responseJson);
    }
  }, [addToast, api, id, router, setErrors, values]);

  useEffect(() => {
    async function readSite() {
      setState((s) => ({ ...s, isDisabled: true }));

      const response = await api.get(`/sites/${id}`);
      const responseJson = await response.json();

      if (response.ok) {
        setValues({
          domain: responseJson.domain,
          name: responseJson.name,
        });

        setState((s) => ({ ...s, isDisabled: false }));
      } else {
        addToast({ body: responseJson.detail || "An error has occurred.", variant: "danger" });

        await router.replace("/sites");
      }
    }

    if (id !== undefined) {
      readSite();
    }
  }, [addToast, api, id, router, setValues]);

  return (
    <Layout kind="app">
      <Head>
        <title>{title}</title>
      </Head>

      <Container className="py-4">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>

          <li className="breadcrumb-item">
            <Link href="/sites">Sites</Link>
          </li>
        </Breadcrumb>

        <h1>{title}</h1>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <fieldset className="vstack gap-3" disabled={state.isDisabled}>
                <Form.Group controlId="form-domain">
                  <Form.Label>Domain</Form.Label>

                  <Form.Control
                    disabled={id !== undefined}
                    isInvalid={errors.domain !== undefined}
                    name="domain"
                    onChange={updateValue}
                    value={values.domain}
                  />

                  <Form.Control.Feedback type="invalid">{errors.domain}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="form-name">
                  <Form.Label>Name</Form.Label>

                  <Form.Control isInvalid={errors.name !== undefined} name="name" onChange={updateValue} value={values.name} />

                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <div className="mt-2">
                  <Button type="submit">Save</Button>
                </div>
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

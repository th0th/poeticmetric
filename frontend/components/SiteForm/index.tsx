import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Breadcrumb, Button, Card, Container, Form } from "react-bootstrap";
import { Layout, ArrayInput } from "..";
import { ToastsContext } from "../../contexts";
import { api } from "../../helpers";
import { useForm, useQueryNumber } from "../../hooks";

type State = {
  isDisabled: boolean;
};

type Form = Pick<Site, "domain" | "isPublic" | "name" | "safeQueryParameters">;

export function SiteForm() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    domain: "",
    isPublic: false,
    name: "",
    safeQueryParameters: [],
  });
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
  }, [addToast, id, router, setErrors, values]);

  useEffect(() => {
    async function readSite() {
      setState((s) => ({ ...s, isDisabled: true }));

      const response = await api.get(`/sites/${id}`);
      const responseJson = await response.json();

      if (response.ok) {
        setValues((values) => ({
          ...values,
          domain: responseJson.domain,
          isPublic: responseJson.isPublic,
          name: responseJson.name,
          safeQueryParameters: responseJson.safeQueryParameters,
        }));

        setState((s) => ({ ...s, isDisabled: false }));
      } else {
        addToast({ body: responseJson.detail || "An error has occurred.", variant: "danger" });

        await router.replace("/sites");
      }
    }

    if (id !== undefined) {
      readSite();
    }
  }, [addToast, id, router, setValues]);

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
              <fieldset className="gap-3 vstack" disabled={state.isDisabled}>
                <Form.Group controlId="domain">
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

                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>

                  <Form.Control isInvalid={errors.name !== undefined} name="name" onChange={updateValue} value={values.name} />

                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="safe-query-parameters">
                  <Form.Label>Safe query parameters</Form.Label>

                  <ArrayInput onValueChange={(q) => updateValue("safeQueryParameters", q)} value={values.safeQueryParameters} />

                  {process.env.NEXT_PUBLIC_HOSTED === "true" ? (
                    <Form.Text>
                      {"You can select privacy-safe query parameters to be saved. For details please see "}
                      <Link href="/docs/websites/query-parameters" target="_blank">here</Link>
                      .
                    </Form.Text>
                  ) : null}

                  <Form.Control.Feedback type="invalid">{errors.safeQueryParameters}</Form.Control.Feedback>
                </Form.Group>

                {process.env.NEXT_PUBLIC_HOSTED === "true" ? (
                  <Form.Group controlId="is-public">
                    <Form.Check
                      checked={values.isPublic}
                      label="Make this site's reports publicly available"
                      name="isPublic"
                      onChange={(event) => updateValue("isPublic", event.target.checked)}
                      type="checkbox"
                    />

                    <Form.Text>
                      {"If you enable this, this site&apos;s stats will be accessible by everyone on "}
                      {`${window.poeticMetric?.frontendBaseUrl}/s?d=${values.domain}`}
                      .
                    </Form.Text>
                  </Form.Group>
                ) : null}

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

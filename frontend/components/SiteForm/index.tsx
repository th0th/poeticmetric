import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { mutate } from "swr";
import { ArrayInput, Breadcrumb, Layout, Title } from "..";
import { ToastsContext } from "../../contexts";
import { api, getIsHosted, getUrl } from "../../helpers";
import { useForm, useQueryParameter } from "../../hooks";
import { GoogleSearchConsoleSiteUrlFormGroup } from "./GoogleSearchConsoleSiteUrlFormGroup";

type State = {
  isDisabled: boolean;
  isReady: boolean;
};

type Form = Pick<Site, "domain" | "googleSearchConsoleSiteUrl" | "isPublic" | "name" | "safeQueryParameters">;

export function SiteForm() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const isIdCheckDone = useRef<boolean>(false);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>({
    domain: "",
    googleSearchConsoleSiteUrl: null,
    isPublic: false,
    name: "",
    safeQueryParameters: [],
  });
  const { hasError: hasIdError, isReady: isIdReady, value: id } = useQueryParameter("id", "number");
  const [state, setState] = useState<State>({ isDisabled: false, isReady: false });

  const title = useMemo(() => (id === undefined ? "Add site" : "Edit site"), [id]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    const response = id === undefined
      ? await api.post("/sites", values)
      : await api.patch(`/sites/${id}`, values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({
        body: id === undefined ? "Site is created. Please add the PoeticMetric tracking script to your site." : "Site is updated.",
        variant: "success",
      });

      mutate("/sites");
      await router.push(id === undefined ? `/sites/reports?id=${responseJson.id}` : "/sites");
    } else {
      setErrors(responseJson);
    }
  }, [addToast, id, router, setErrors, values]);

  const read = useCallback(async () => {
    const response = await api.get(`/sites/${id}`);
    const responseJson = await response.json();

    if (!response.ok) {
      addToast({ body: responseJson?.detail || "An error has occurred.", variant: "danger" });
      await router.replace("/sites");

      return;
    }

    setValues((values) => ({
      ...values,
      domain: responseJson.domain,
      googleSearchConsoleSiteUrl: responseJson.googleSearchConsoleSiteUrl,
      isPublic: responseJson.isPublic,
      name: responseJson.name,
      safeQueryParameters: responseJson.safeQueryParameters,
    }));

    setState((s) => ({ ...s, isReady: true }));
  }, [addToast, id, router, setValues]);

  useEffect(() => {
    if (isIdCheckDone.current || !isIdReady) {
      return;
    }

    isIdCheckDone.current = true;

    if (hasIdError) {
      addToast({ body: "Not found.", variant: "danger" });

      router.replace("/sites");
    }

    if (!state.isReady) {
      if (id === undefined) {
        setState((s) => ({ ...s, isReady: true }));
      } else {
        read();
      }
    }
  }, [addToast, hasIdError, id, isIdReady, read, router, state.isReady]);

  return (
    <Layout kind="app">
      <Title>{title}</Title>

      <Container className="d-flex flex-column flex-grow-1 py-5">
        {state.isReady ? (
          <>
            <Breadcrumb items={[{ href: "/sites", title: "Sites" }]} title={title} />

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

                      {getIsHosted() ? (
                        <Form.Text>
                          {"You can select privacy-safe query parameters to be saved. For details please see "}
                          <Link href="/docs/websites/query-parameters" target="_blank">here</Link>
                          .
                        </Form.Text>
                      ) : null}

                      <Form.Control.Feedback type="invalid">{errors.safeQueryParameters}</Form.Control.Feedback>
                    </Form.Group>

                    <GoogleSearchConsoleSiteUrlFormGroup
                      onValueChange={(v) => updateValue("googleSearchConsoleSiteUrl", v)}
                      value={values.googleSearchConsoleSiteUrl}
                    />

                    {getIsHosted() ? (
                      <Form.Group controlId="is-public">
                        <Form.Check
                          checked={values.isPublic}
                          label="Make this site's reports publicly available"
                          name="isPublic"
                          onChange={(event) => updateValue("isPublic", event.target.checked)}
                          type="checkbox"
                        />

                        <Form.Text>
                          {"If you enable this, this site's stats will be accessible by everyone on "}
                          {getUrl(`s?d=${values.domain}`)}
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
          </>
        ) : (
          <Spinner className="m-auto" variant="primary" />
        )}
      </Container>
    </Layout>
  );
}

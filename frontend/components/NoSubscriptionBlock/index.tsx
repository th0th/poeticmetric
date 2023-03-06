import Link from "next/link";
import React, { useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import { AuthContext } from "../../contexts";
import { Layout } from "../Layout";

export function NoSubscriptionBlock() {
  const { organization } = useContext(AuthContext);

  return (
    <Layout kind="app">
      <Container className="align-items-center d-flex flex-column flex-grow-1 justify-content-center py-5">
        {organization === null || organization.plan !== null ? (
          <Spinner />
        ) : (
          <div className="text-center">
            <i className="bi bi-envelope-at bis-5rem text-primary" />

            <h3></h3>

            <div className="fs-5 fw-medium text-muted">You need to verify your e-mail address to continue.</div>

            <div className="mt-4">
              <Link className="btn btn-lg btn-primary" href="/billing">Go to billing</Link>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}

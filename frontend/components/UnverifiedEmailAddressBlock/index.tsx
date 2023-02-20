import React from "react";
import { Container } from "react-bootstrap";
import { Layout } from "../Layout";

export function UnverifiedEmailAddressBlock() {
  return (
    <Layout kind="app">
      <Container className="align-items-center d-flex flex-column flex-grow-1 justify-content-center py-5">
        <div className="text-center">
          <i className="bi bi-envelope-at bis-5rem text-primary" />

          <h3>Please verify your e-mail address</h3>

          <div className="fs-5 fw-medium text-muted">You need to verify your e-mail address to continue.</div>
        </div>
      </Container>
    </Layout>
  );
}

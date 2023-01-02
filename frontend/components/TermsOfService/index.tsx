import React from "react";
import { Card, Container } from "react-bootstrap";
import { Layout, Markdown, Title } from "..";

export type TermsOfServiceProps = {
  content: string;
};

export function TermsOfService({ content }: TermsOfServiceProps) {
  return (
    <Layout headerKind="website">
      <Title>Terms of service</Title>

      <Container className="py-5">
        <h1 className="fs-2 fw-bold mb-3">Terms of service</h1>

        <Card>
          <Card.Body>
            <Markdown>
              {content}
            </Markdown>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

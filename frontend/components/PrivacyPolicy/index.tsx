import React from "react";
import { Card, Container } from "react-bootstrap";
import { Layout, Markdown, Title } from "..";

export type PrivacyPolicyProps = {
  content: string;
};

export function PrivacyPolicy({ content }: PrivacyPolicyProps) {
  return (
    <Layout kind="website">
      <Title>Privacy policy</Title>

      <Container className="py-5">
        <h1 className="fs-2 fw-bold mb-3">Privacy policy</h1>

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

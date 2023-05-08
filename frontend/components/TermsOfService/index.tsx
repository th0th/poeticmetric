import React from "react";
import { Card, Container } from "react-bootstrap";
import { CanonicalLink, Description, Layout, Markdown, Title } from "..";

export type TermsOfServiceProps = {
  content: string;
};

export function TermsOfService({ content }: TermsOfServiceProps) {
  return (
    <Layout kind="website">
      <CanonicalLink path="/terms-of-service" />

      <Title>Terms of service</Title>

      <Description>
        Before using PoeticMetric, it&apos;s important to understand our terms of service. Our terms of service page outlines the rules and
        guidelines you must follow when using our website analytics tool. We are committed to providing a fair, transparent, and
        regulation-compliant service. Read our terms of service to learn more about what you can expect from PoeticMetric.
      </Description>

      <Container className="py-5">
        <h1>Terms of service</h1>

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

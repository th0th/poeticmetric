import React from "react";
import { Card, Container } from "react-bootstrap";
import { CanonicalLink, Description, Layout, Markdown, Title } from "..";

export type PrivacyPolicyProps = {
  content: string;
};

export function PrivacyPolicy({ content }: PrivacyPolicyProps) {
  return (
    <Layout kind="website">
      <CanonicalLink path="/privacy-policy" />

      <Title>Privacy policy</Title>

      <Description>
        At PoeticMetric, we take your privacy seriously. Our privacy policy page outlines how we collect, use, and protect your data when
        you use our web analytics tool. We respect your privacy and are committed to ensuring the confidentiality and security of your
        information. Learn more about our privacy-first approach at PoeticMetric.
      </Description>

      <Container className="py-5">
        <h1>Privacy policy</h1>

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

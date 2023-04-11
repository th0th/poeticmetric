import React from "react";
import { Container } from "react-bootstrap";
import { CanonicalLink, Description, Layout, Markdown, MetaOpenGraph, Title } from "..";

export type ManifestoProps = {
  content: string;
};

export function Manifesto({ content }: ManifestoProps) {
  return (
    <Layout kind="website">
      <CanonicalLink path="/manifesto" />

      <Title>Manifesto</Title>

      <Description>
        Discover the principles that guide PoeticMetric. Our privacy-first approach, commitment to transparency, dedication to
        sustainability, and focus on efficiency set us apart in the analytics industry. Read our manifesto now.
      </Description>

      <MetaOpenGraph
        description="Privacy is not dead unlike they told us and we are here to back it up. Here are the four principles we stay true to in the making of the PoeticMetric."
        image={{
          height: 1080,
          path: "/whatsapp-privacy-newspaper.jpg",
          width: 1920,
        }}
        title="Manifesto"
      />

      <Container className="py-5">
        <div className="mx-auto mw-45rem">
          <Markdown>
            {content}
          </Markdown>
        </div>
      </Container>
    </Layout>
  );
}

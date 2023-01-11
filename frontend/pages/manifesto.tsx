import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import path from "path";
import React from "react";
import { Container } from "react-bootstrap";
import { Description, Layout, Markdown, MetaOpenGraph, Title } from "../components";

type ManifestoProps = {
  content: string;
};

export default function Manifesto({ content }: ManifestoProps) {
  return (
    <Layout kind="website">
      <Title>Manifesto</Title>

      <Description>
        Discover the principles that guide PoeticMetric. Our privacy-first approach, commitment to transparency, dedication to
        sustainability, and focus on efficiency set us apart in the analytics industry. Read our manifesto now.
      </Description>

      <MetaOpenGraph
        description="Privacy is not dead unlike they told us and we are here to back it up. Here are the four principles we stay true to in the making of the PoeticMetric."
        image={{
          height: 1080,
          url: `${process.env.NEXT_PUBLIC_POETICMETRIC_FRONTEND_BASE_URL}/whatsapp-privacy-newspaper.jpg`,
          width: 1920,
        }}
        title="Manifesto"
      />

      <Container className="py-5">
        <div className="mx-auto mw-45rem">
          <h1>PoeticMetric&apos;s Manifesto</h1>

          <Markdown>{content}</Markdown>
        </div>
      </Container>
    </Layout>
  );
}

export function getStaticProps(): GetStaticPropsResult<ManifestoProps> {
  const markdownFilePath = path.join(path.dirname(process.cwd()), "MANIFESTO.md");
  const markdownFileBuffer = fs.readFileSync(markdownFilePath);

  const markdown = matter(markdownFileBuffer);

  return {
    props: {
      content: markdown.content,
    },
  };
}

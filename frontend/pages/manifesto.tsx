import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import path from "path";
import React from "react";
import { Manifesto } from "../components";

type ManifestoProps = {
  content: string;
};

export default function ManifestoPage({ content }: ManifestoProps) {
  return (
    <Manifesto content={content} />
  );
}

export function getStaticProps(): GetStaticPropsResult<ManifestoProps> {
  const markdownFilePath = process.env.NEXT_PUBLIC_POETICMETRIC_STAGE === "development"
    ? path.join(path.dirname(process.cwd()), "MANIFESTO.md")
    : path.join(process.cwd(), "components", "Manifesto", "manifesto.md");

  const markdownFileBuffer = fs.readFileSync(markdownFilePath);

  const markdown = matter(markdownFileBuffer);

  return {
    props: {
      content: markdown.content,
    },
  };
}

import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import path from "path";
import React from "react";
import { OpenSource } from "../components";

type OpenSourceProps = {
  content: string;
};

export default function OpenSourcePage({ content }: OpenSourceProps) {
  return (
    <OpenSource content={content} />
  );
}

export function getStaticProps(): GetStaticPropsResult<OpenSourceProps> {
  const markdownFilePath = path.join(process.cwd(), "components", "OpenSource", "content.md");

  const markdownFileBuffer = fs.readFileSync(markdownFilePath);

  const markdown = matter(markdownFileBuffer);

  return {
    props: {
      content: markdown.content,
    },
  };
}

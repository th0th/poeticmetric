import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import path from "path";
import { TermsOfService as BaseTermsOfService, TermsOfServiceProps as BaseTermsOfServiceProps } from "../components";

export default function TermsOfService(props: BaseTermsOfServiceProps) {
  return (
    <BaseTermsOfService {...props} />
  );
}

export function getStaticProps(): GetStaticPropsResult<BaseTermsOfServiceProps> {
  const markdownFilePath = path.join(process.cwd(), "components", "TermsOfService", "terms-of-service.md");
  const markdownFileBuffer = fs.readFileSync(markdownFilePath);

  const markdown = matter(markdownFileBuffer);

  return {
    props: {
      content: markdown.content,
    },
  };
}

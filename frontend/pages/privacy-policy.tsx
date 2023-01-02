import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import path from "path";
import { PrivacyPolicy as BasePrivacyPolicy, PrivacyPolicyProps as BasePrivacyPolicyProps } from "../components";

export default function TermsOfService(props: BasePrivacyPolicyProps) {
  return (
    <BasePrivacyPolicy {...props} />
  );
}

export function getStaticProps(): GetStaticPropsResult<BasePrivacyPolicyProps> {
  const markdownFilePath = path.join(process.cwd(), "components", "PrivacyPolicy", "privacy-policy.md");
  const markdownFileBuffer = fs.readFileSync(markdownFilePath);

  const markdown = matter(markdownFileBuffer);

  return {
    props: {
      content: markdown.content,
    },
  };
}

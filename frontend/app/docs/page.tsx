import { Metadata } from "next";
import path from "path";
import Breadcrumb from "~components/Breadcrumb";
import Markdown from "~components/Markdown";
import getIndexFileContent from "~helpers/docs/getIndexFileContent";
import getPath from "~helpers/docs/getPath";
import get from "~helpers/markdown/get";

export async function generateMetadata(): Promise<Metadata> {
  const mdx = get(path.join(getPath(), "index.mdx"));

  return {
    description: mdx.excerpt,
    title: mdx.frontMatter.title,
  };
}

export default async function Page() {
  const mdxString = getIndexFileContent();

  return (
    <>
      <Breadcrumb items={[{ href: "/docs", title: "Docs" }]} title="Foreword" />

      <Markdown generateToc source={mdxString} />
    </>
  );
}

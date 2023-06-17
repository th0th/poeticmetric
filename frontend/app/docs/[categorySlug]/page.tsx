import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Breadcrumb from "~components/Breadcrumb";
import Markdown from "~components/Markdown";
import getArticleFileContent from "~helpers/docs/getArticleFileContent";
import getArticleFilePath from "~helpers/docs/getArticleFilePath";
import getCategorySlugs from "~helpers/docs/getCategorySlugs";
import get from "~helpers/markdown/get";

type PageProps = {
  params: {
    categorySlug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const mdx = get(getArticleFilePath(params.categorySlug, "index"));

  return {
    description: mdx.excerpt,
    title: mdx.frontMatter.title,
  };
}

export async function generateStaticParams(): Promise<Array<PageProps["params"]>> {
  return getCategorySlugs().map((categorySlug) => ({ categorySlug }));
}

export default async function Page({ params }: PageProps) {
  const mdxString = getArticleFileContent(params.categorySlug, "index");
  const mdx = await serialize<Record<string, unknown>, Record<string, string>>(mdxString, { parseFrontmatter: true });

  return (
    <>
      <Breadcrumb items={[{ href: "/docs", title: "Docs" }]} title={mdx.frontmatter.title} />

      <Markdown generateToc source={mdxString} />
    </>
  );
}

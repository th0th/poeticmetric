import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Breadcrumb from "~components/Breadcrumb";
import Markdown from "~components/Markdown";
import getArticleFileContent from "~helpers/docs/getArticleFileContent";
import getArticleFilePath from "~helpers/docs/getArticleFilePath";
import getCategoryArticleSlugs from "~helpers/docs/getCategoryArticleSlugs";
import getCategorySlugs from "~helpers/docs/getCategorySlugs";
import get from "~helpers/markdown/get";

type PageProps = {
  params: {
    articleSlug: string;
    categorySlug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const indexMdx = get(getArticleFilePath(params.categorySlug, "index"));
  const mdx = get(getArticleFilePath(params.categorySlug, params.articleSlug));

  return {
    description: mdx.excerpt,
    title: `${mdx.frontMatter.title} - ${indexMdx.frontMatter.title}`,
  };
}

export async function generateStaticParams(): Promise<Array<PageProps["params"]>> {
  const params: Array<PageProps["params"]> = [];

  const categorySlugs = getCategorySlugs();

  for (const categorySlug of categorySlugs) {
    const articleSlugs = getCategoryArticleSlugs(categorySlug);

    for (const articleSlug of articleSlugs) {
      params.push({ articleSlug, categorySlug });
    }
  }

  return params;
}

export default async function Page({ params }: PageProps) {
  const indexMdxString = getArticleFileContent(params.categorySlug, "index");
  const indexMdx = await serialize<Record<string, unknown>, Record<string, string>>(indexMdxString, { parseFrontmatter: true });

  const mdxString = getArticleFileContent(params.categorySlug, params.articleSlug);
  const mdx = await serialize<Record<string, unknown>, Record<string, string>>(mdxString, { parseFrontmatter: true });

  return (
    <>
      <Breadcrumb
        items={[
          { href: "/docs", title: "Docs" },
          { href: `/docs/${params.categorySlug}`, title: indexMdx.frontmatter.title },
        ]}
        title={mdx.frontmatter.title}
      />

      <Markdown generateToc source={mdxString} />
    </>
  );
}

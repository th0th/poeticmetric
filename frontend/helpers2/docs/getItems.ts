import { serialize } from "next-mdx-remote/serialize";
import getArticleFileContent from "./getArticleFileContent";
import getCategoryArticleSlugs from "./getCategoryArticleSlugs";
import getCategorySlugs from "./getCategorySlugs";

export default async function getItems(): Promise<DocsItems> {
  const items: DocsItems = [];

  for (const categorySlug of getCategorySlugs()) {
    const indexMdxString = getArticleFileContent(categorySlug, "index");
    const indexMdx = await serialize<Record<string, unknown>, Record<string, string>>(indexMdxString, { parseFrontmatter: true });

    const category: DocsCategory = {
      articles: [],
      slug: categorySlug,
      title: indexMdx.frontmatter.title,
    };

    for (const articleSlug of getCategoryArticleSlugs(categorySlug)) {
      const articleMdxString = getArticleFileContent(categorySlug, articleSlug);
      const articleMdx = await serialize<Record<string, unknown>, Record<string, string>>(articleMdxString, { parseFrontmatter: true });

      const article: DocsArticle = {
        slug: articleSlug,
        title: articleMdx.frontmatter.title,
      };

      category.articles.push(article);
    }

    items.push(category);
  }

  return items;
}

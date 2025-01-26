import matter from "gray-matter";
import { omit } from "lodash-es";
import { markdownToTxt } from "markdown-to-txt";

export function getDocsCategories(): Array<DocsCategoryWithArticles> {
  const categoriesMap: Record<string, DocsCategoryWithArticles> = {};

  const articleFiles = import.meta.glob<true, string, string>("/src/docs/**/*.md", { eager: true, import: "default", query: "?raw" });

  for (const articleFilePath of Object.keys(articleFiles)) {
    const [, , , categoryDir, articleFile] = articleFilePath.split("/");

    if (categoryDir.startsWith("_")) {
      continue;
    }

    const [, categorySlug] = categoryDir.split("_");

    if (categoriesMap[categorySlug] === undefined) {
      categoriesMap[categorySlug] = {
        articles: [],
        slug: categoryDir.split("_")[1],
        title: "",
      };
    }

    const fileContent = articleFiles[articleFilePath];
    const md = matter(fileContent);

    if (articleFile === "index.md") {
      categoriesMap[categorySlug].title = md.data.title;
    } else {
      const article: DocsArticle = {
        content: md.content,
        icon: md.data.icon,
        path: `/${articleFilePath.split("/").slice(1, -1).join("/")}`,
        slug: articleFile.split("_")[1].split(".")[0],
        title: md.data.title,
        type: "docsArticle",
      };

      categoriesMap[categorySlug].articles.push(article);
    }
  }

  return Object.keys(categoriesMap).map((categorySlug) => ({
    articles: categoriesMap[categorySlug].articles,
    slug: categorySlug,
    title: categoriesMap[categorySlug].title,
  }));
}

export function getDocsArticleAssets() {
  return import.meta.glob<string>([
    "/src/docs/**/*.gif",
    "/src/docs/**/*.jpg",
    "/src/docs/**/*.ogg",
    "/src/docs/**/*.png",
    "/src/docs/**/*.svg",
  ], { eager: true, import: "default" });
}

export function getDocsCache(): DocsCache {
  const categories = getDocsCategories();

  const articles = [];

  for (const category of categories) {
    articles.push(...category.articles.map((article) => ({
      article: {
        ...article,
        content: markdownToTxt(article.content),
      },
      category: omit(category, ["articles"]),
    })));
  }

  return articles;
}

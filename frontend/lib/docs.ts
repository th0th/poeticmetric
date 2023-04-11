import fs from "fs";
import matter from "gray-matter";
import { markdownToTxt } from "markdown-to-txt";
import path from "path";

const docCategories: Array<Omit<DocsCategory, "articles">> = [
  { slug: "getting-started", title: "Getting started" },
  { slug: "websites", title: "Websites" },
  { slug: "team", title: "Team" },
];

export function getDocs(): Array<DocsCategory> {
  return docCategories.map((docCategory) => {
    const articles: DocsCategory["articles"] = [];

    const categoryPath = path.join(process.cwd(), "docs", docCategory.slug);

    fs.readdirSync(categoryPath).forEach((articleFile) => {
      const articleFilePath = path.join(categoryPath, articleFile);
      const slug = articleFile.split(".")[0].split("_")[1];
      const articleFileContent = fs.readFileSync(articleFilePath);
      const markdown = matter(articleFileContent, { excerpt_separator: "<!-- end -->" });

      const { content, excerpt } = markdown;
      const { title } = markdown.data;

      if (excerpt === undefined || excerpt === "") {
        throw new Error(`The article ${docCategory.slug}/${slug} doesn't have an excerpt.`);
      }

      articles.push({ category: docCategory, content, excerpt: markdownToTxt(excerpt), slug, title });
    });

    return { ...docCategory, articles };
  });
}

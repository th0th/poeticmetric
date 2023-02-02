const path = require("path");
const fs = require("fs");
const { markdownToTxt } = require("markdown-to-txt");
const matter = require("gray-matter");

const categories = [
  { slug: "getting-started", title: "Getting started" },
  { slug: "websites", title: "Websites" },
];

function generateDocsCache() {
  const docsPath = path.join(path.dirname(__dirname), "docs");

  const articles = [];

  categories.forEach((category) => {
    const categoryPath = path.join(docsPath, category.slug);
    const articleFiles = fs.readdirSync(categoryPath).sort();

    articleFiles.forEach((articleFile) => {
      const articleFileName = articleFile.slice(0, -3);
      const [, slug] = articleFileName.split("_");
      const articleFilePath = path.join(categoryPath, articleFile);
      const articleFileContent = fs.readFileSync(articleFilePath);

      const markdown = matter(articleFileContent);

      articles.push({
        category: category.title,
        content: markdownToTxt(markdown.content),
        href: `/docs/${category.slug}/${slug}`,
        title: markdown.data.title,
      });
    });
  });

  const outPath = path.join(path.dirname(__dirname), "components", "DocsArticle", "Menu", "Search", "cache.json");

  fs.writeFileSync(outPath, JSON.stringify(articles), { flag: "w" });
}

generateDocsCache();

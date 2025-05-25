import dayjs from "dayjs";
import { Feed } from "feed";
import matter from "gray-matter";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getBaseDir, baseURL } from "./base.js";

const baseDir = getBaseDir();
const outDir = join(baseDir, "public", "blog");
const feedFileName = "feed.xml";
const outPath = join(outDir, feedFileName);

function generateBlogFeed() {
  const blogPath = join(baseDir, "src", "blog");
  const blogPostPaths = readdirSync(blogPath).sort().reverse();

  const feed = new Feed({
    author: { link: "https://www.poeticmetric.com", name: "PoeticMetric Team" },
    copyright: "All rights reserved, WebGazer, Inc.",
    favicon: `${baseURL}/favicon.ico`,
    feed: `${baseURL}/blog/${feedFileName}`,
    generator: "PoeticMetric",
    id: `${baseURL}/blog`,
    image: `${baseURL}`,
    language: "en",
    link: `${baseURL}/blog`,
    title: "PoeticMetric Blog RSS",
  });

  blogPostPaths.forEach((blogPostPath) => {
    const [dateString, slug] = blogPostPath.split("_");
    const markdownContent = readFileSync(join(blogPath, blogPostPath, "post.md"));
    const markdown = matter(markdownContent);

    const date = dayjs(dateString);
    const link = `${baseURL}/blog/${slug}`;

    feed.addItem({
      author: markdown.data.author !== undefined ? [
        { name: markdown.data.author },
      ] : undefined,
      date: date.toDate(),
      description: markdown.data.description,
      id: link,
      link,
      title: markdown.data.title,
    });
  });

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, feed.atom1(), { flag: "w" });
}

generateBlogFeed();

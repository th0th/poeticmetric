import dayjs from "dayjs";
import matter from "gray-matter";
import { orderBy } from "lodash-es";

type ImportedCover = {
  default: string;
};

export function getBlogPosts(): Array<BlogPost> {
  const blogPosts: Array<BlogPost> = [];

  const rawPostFiles = import.meta.glob<true, string, string>("/src/blog/*/post.md", { eager: true, import: "default", query: "?raw" });
  const coverFiles = import.meta.glob<ImportedCover>(["/src/blog/*/cover.*"], { eager: true });

  const slugCovers = Object.entries(coverFiles).reduce<Record<string, string>>((ac, cv) => {
    return { ...ac, [cv[0].split("/")[3].split("_")[1]]: cv[1].default };
  }, {});

  for (const filePath in rawPostFiles) {
    const path = `/${filePath.split("/").slice(1, -1).join("/")}`;
    const fileContent = rawPostFiles[filePath];
    const md = matter(fileContent);
    const { content } = md;
    const date = dayjs(filePath.split("/")[3].split("_")[0]);
    const [, slug] = filePath.split("/")[3].split("_");
    const coverUrl = slugCovers[slug];

    const { description, metaTitle, title } = md.data;

    if (typeof title !== "string") {
      throw new Error("Blog post is not valid.");
    }

    blogPosts.push({ content, coverUrl, date, description, metaTitle, path, slug, title, type: "blogPost" });
  }

  return orderBy(blogPosts, ["date"], ["desc"]);
}

export function getBlogPostAssets() {
  return import.meta.glob<string>([
    "/src/blog/**/*.jpg",
    "/src/blog/**/*.png",
  ], { eager: true, import: "default" });
}

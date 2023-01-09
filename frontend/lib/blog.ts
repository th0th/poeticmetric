import dayjs from "dayjs";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

const pageSize: number = 10;

const blogPath = path.join(process.cwd(), "blog");
const allBlogPostFiles = fs.readdirSync(blogPath)
  .filter((p) => p.endsWith(".md") && !p.endsWith("skip.md"))
  .sort()
  .reverse();

const posts: Array<BlogPost> = allBlogPostFiles.map((blogPostFileName) => {
  const blogPostFilePath = path.join(blogPath, blogPostFileName);
  const markdownFileName = blogPostFileName.slice(0, -3);
  const [dateString, slug] = markdownFileName.split("_");
  const date = dayjs(dateString);
  const publicPath = path.join("/blog-files", markdownFileName);
  const markdownFileContent = fs.readFileSync(blogPostFilePath);

  const markdown = matter(markdownFileContent, {
    excerpt_separator: "<!-- end -->",
  });

  return {
    author: markdown.data.author || null,
    content: markdown.content,
    date,
    excerpt: markdown.excerpt || "",
    href: `/blog/${slug}`,
    image: path.join(publicPath, "image.jpg"),
    markdownFile: blogPostFilePath,
    publicPath,
    slug,
    title: markdown.data.title,
  };
});

export const blog = {
  pageCount: Math.ceil(posts.length / pageSize),
  pageSize,
  posts,
};

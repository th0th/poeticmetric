import dayjs from "dayjs";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

type Blog = {
  pageCount: number;
  pageSize: number;
  posts: Array<BlogPost>;
};

const pageSize: number = 10;
const blogPath = path.join(process.cwd(), "blog");

let data: Blog | null = null;

export function getBlog(): Blog {
  if (process.env.NEXT_PUBLIC_DISABLE_MARKDOWN_CACHE === "false" && data !== null) {
    return data;
  }

  data = {
    pageCount: Math.ceil(getPostFiles().length / pageSize),
    pageSize,
    posts: getPosts(),
  };

  return data;
}

function getPostFiles(): Array<string> {
  return fs.readdirSync(blogPath)
    .filter((p) => p.endsWith(".md") && !p.endsWith("skip.md"))
    .sort()
    .reverse();
}

function getPosts(): Array<BlogPost> {
  return getPostFiles().map((blogPostFileName) => {
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
}

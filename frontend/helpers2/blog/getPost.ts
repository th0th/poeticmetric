import dayjs from "dayjs";
import path from "path";
import getPostFilePath from "~helpers/blog/getPostFilePath";
import getPostFileRelativePath from "~helpers/blog/getPostFileRelativePath";
import get from "~helpers/markdown/get";

export default function getPost(slug: string): BlogPost {
  const postFileRelativePath = getPostFileRelativePath(slug);
  const postFilePath = getPostFilePath(slug);
  const mdx = get(postFilePath);
  const dateString = postFileRelativePath.split("_")[0];
  const publicPath = path.join(`/blog-files/${postFileRelativePath.slice(0, -4)}`);

  return {
    author: mdx.frontMatter.author || null,
    content: mdx.content,
    date: dayjs(dateString),
    excerpt: mdx.excerpt,
    image: path.join(publicPath, "image.jpg"),
    publicPath,
    slug,
    title: mdx.frontMatter.title,
  };
}

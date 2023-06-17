import matter from "gray-matter";
import markdownToTxt from "markdown-to-txt";

export default async function parse(source: string) {
  const m = matter(source, { excerpt_separator: "{/* more */}" });

  return {
    content: m.content,
    excerpt: m.excerpt === undefined ? undefined : markdownToTxt(m.excerpt),
    frontMatter: m.data,
  };
}

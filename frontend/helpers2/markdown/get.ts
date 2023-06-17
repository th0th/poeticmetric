import fs from "fs";
import matter from "gray-matter";
import markdownToTxt from "markdown-to-txt";

export default function get(path: string) {
  const source = fs.readFileSync(path, "utf-8");

  const m = matter(source, { excerpt_separator: "{/* more */}" });

  return {
    content: m.content,
    excerpt: m.excerpt === undefined ? undefined : markdownToTxt(m.excerpt),
    frontMatter: m.data,
  };
}

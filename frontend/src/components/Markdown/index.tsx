import ReactMarkdown from "react-markdown";
import { Link } from "wouter";
import styles from "./Markdown.module.css";

type MarkdownProps = {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      children={content}
      className={styles.markdown}
      components={{
        a: ({ children, href = "/" }) => (
          <Link className="link link-animate" href={href}>{children}</Link>
        ),
      }}
    />
  );
}

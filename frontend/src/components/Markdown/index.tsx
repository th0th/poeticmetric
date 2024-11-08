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
      components={{
        a: ({ children, href = "/" }) => (
          <Link className="link link-animate" href={href}>{children}</Link>
        ),
        h1: ({ children }) => (
          <h1 className={styles.h1}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={styles.h2}>{children}</h2>
        ),
        p: ({ children }) => (
          <p className={styles.p}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong className={styles.strong}>{children}</strong>
        ),
      }}
    />
  );
}

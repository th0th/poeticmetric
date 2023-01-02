import React from "react";
import BaseMarkdown from "markdown-to-jsx";
import styles from "./Markdown.module.scss";

export type MarkdownProps = {
  children: string;
  className?: string;
};

export function Markdown({ className, ...props }: MarkdownProps) {
  return (
    <BaseMarkdown {...props} className={`${styles.markdown} ${className}`} />
  );
}

import classNames from "classnames";
import hljs from "highlight.js";
import BaseMarkdown from "markdown-to-jsx";
import React, { useEffect, useRef } from "react";
import styles from "./Markdown.module.scss";

export type MarkdownProps = {
  children: string;
  className?: string;
};

export function Markdown({ className, ...props }: MarkdownProps) {
  const div = useRef<HTMLDivElement>(null);
  const previousChildren = useRef<string>("");

  useEffect(() => {
    if (div.current !== null && props.children !== previousChildren.current) {
      div.current.querySelectorAll<HTMLElement>("pre code").forEach((e) => hljs.highlightElement(e));

      previousChildren.current = props.children;
    }
  }, [props.children]);

  return (
    <div className={classNames(styles.markdown, className)} ref={div}>
      <BaseMarkdown
        {...props}
        options={{
          wrapper: React.Fragment,
        }}
      />
    </div>
  );
}

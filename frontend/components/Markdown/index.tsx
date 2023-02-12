import classNames from "classnames";
import hljs from "highlight.js";
import BaseMarkdown, { MarkdownToJSX } from "markdown-to-jsx";
import React, { useEffect, useMemo, useRef } from "react";
import { Alert } from "./Alert";
import { Anchor } from "./Anchor";
import styles from "./Markdown.module.scss";

export type MarkdownProps = {
  children: string;
  className?: string;
};

export function Markdown({ className, ...props }: MarkdownProps) {
  const div = useRef<HTMLDivElement>(null);
  const previousChildren = useRef<string>("");

  const options: MarkdownToJSX.Options = useMemo<MarkdownToJSX.Options>(() => ({
    forceWrapper: true,
    overrides: {
      Alert,
      a: Anchor,
    },
    wrapper: React.Fragment,
  }), []);

  useEffect(() => {
    if (div.current !== null && props.children !== previousChildren.current) {
      div.current.querySelectorAll<HTMLElement>("pre code").forEach((e) => hljs.highlightElement(e));

      previousChildren.current = props.children;
    }
  }, [props.children]);

  return (
    <div className={classNames(styles.markdown, className)} ref={div}>
      <BaseMarkdown{...props} options={options} />
    </div>
  );
}

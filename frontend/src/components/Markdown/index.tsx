import { IconAt } from "@tabler/icons-react";
import classNames from "classnames";
import BaseMarkdown, { MarkdownToJSX } from "markdown-to-jsx";
import { useMemo } from "react";
import MarkdownContext from "~/contexts/MarkdownContext";
import Alert from "./Alert";
import Anchor from "./Anchor";
import Blockquote from "./Blockquote";
import Image from "./Image";
import styles from "./Markdown.module.scss";
import Pre from "./Pre";
import Table from "./Table";
import TableOfContents from "./TableOfContents";

export type MarkdownProps = {
  children: string;
  className?: string;
  options?: Omit<MarkdownToJSX.Options, "forceWrapper" | "wrapper">;
  path?: string;
  type?: Markdown["type"];
};

export default function Markdown({ children, className, options: optionsFromProps, path, type, ...props }: MarkdownProps) {
  const content = useMemo(() => children, [children]);

  const options: MarkdownToJSX.Options = useMemo<MarkdownToJSX.Options>(() => ({
    ...optionsFromProps,
    forceWrapper: true,
    overrides: {
      ...optionsFromProps?.overrides,
      Alert,
      IconAt,
      TableOfContents,
      a: Anchor,
      blockquote: Blockquote,
      img: Image,
      pre: Pre,
      table: Table,
    },
    wrapper: "div",
  }), [optionsFromProps]);

  return (
    <MarkdownContext.Provider value={{ content, path, type }}>
      <BaseMarkdown {...props} className={classNames(styles.markdown, className)} options={options}>{children}</BaseMarkdown>
    </MarkdownContext.Provider>
  );
}

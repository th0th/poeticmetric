import { MDXComponents } from "mdx/types";
import MarkdownAnchor from "~components/MarkdownAnchor";
import MarkdownWrapper from "~components/MarkdownWrapper";

export default function getMdxComponents(withWrapper: boolean = true) {
  let mdxComponents: MDXComponents = {
    a: MarkdownAnchor,
  };

  if (withWrapper) {
    mdxComponents.wrapper = MarkdownWrapper;
  }

  return mdxComponents;
}

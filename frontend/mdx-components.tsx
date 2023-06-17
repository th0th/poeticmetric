import type { MDXComponents } from "mdx/types";
import getMdxComponents from "~helpers/getMdxComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...getMdxComponents(),
  };
}

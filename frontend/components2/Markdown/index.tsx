import rehypeToc from "@jsdevtools/rehype-toc";
import { HtmlElementNode } from "@jsdevtools/rehype-toc/lib/types";
import { SerializeOptions } from "next-mdx-remote/dist/types"; // eslint-disable-line import/no-unresolved
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeExtractExcerpt from "rehype-extract-excerpt";
import rehypeSlug from "rehype-slug";
import MarkdownWrapper from "~components/MarkdownWrapper";
import getMdxComponents from "~helpers/getMdxComponents";

export type MarkdownProps = Overwrite<MDXRemoteProps, {
  className?: string;
  generateToc?: boolean;
}>;

export default function Markdown({ className, components, generateToc = false, options, ...props }: MarkdownProps) {
  let rehypePlugins: Array<any> = [rehypeExtractExcerpt];

  if (generateToc) {
    rehypePlugins.push([rehypeSlug, [rehypeToc, {
      customizeTOC: (toc: HtmlElementNode) => {
        if ((toc.children?.[0] as HtmlElementNode | undefined)?.children?.length === 0) {
          return false;
        }

        return toc;
      },
    }]]);
  }

  return (
    <MarkdownWrapper className={className}>
      <MDXRemote
        {...props}
        components={{ ...getMdxComponents(false), ...components }}
        options={{
          mdxOptions: { rehypePlugins },
          parseFrontmatter: true,
          ...options,
        }}
      />
    </MarkdownWrapper>
  );
}

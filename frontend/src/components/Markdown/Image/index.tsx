import classNames from "classnames";
import { JSX, PropsWithoutRef, useContext, useMemo } from "react";
import MarkdownContext from "~/contexts/MarkdownContext";
// import { getBlogPostAssets } from "~/lib/blog";
import { getDocsArticleAssets } from "~/lib/docs";

export type ImageProps = PropsWithoutRef<JSX.IntrinsicElements["img"]>;

const assetsMap: Record<Exclude<Markdown["type"], undefined>, Record<string, string>> = {
  // blogPost: getBlogPostAssets(),
  docsArticle: getDocsArticleAssets(),
};

export default function Image({ alt, className: classNameFromProps, src: srcFromProps, style, ...props }: ImageProps) {
  const { path, type } = useContext(MarkdownContext);

  const src = useMemo(() => {
    if (type === undefined || typeof srcFromProps !== "string" || !srcFromProps.startsWith("./")) {
      return srcFromProps;
    }

    return assetsMap[type][`${path}${srcFromProps.slice(1)}`];
  }, [path, srcFromProps, type]);

  const className = useMemo(() => classNames(
    "border d-block m-auto rounded",
    { "mw-100": style?.maxWidth === undefined },
    classNameFromProps,
  ), [classNameFromProps, style]);

  return (
    <img {...props} alt={alt} className={className} src={src} style={style} />
  );
}

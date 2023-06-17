import Link from "next/link";
import React from "react";

export type MarkdownAnchorProps = React.PropsWithoutRef<JSX.IntrinsicElements["a"]>;

export default function MarkdownAnchor({ children, href, ...props }: MarkdownAnchorProps) {
  if (
    href?.startsWith("/")
    && !href?.endsWith(".gif")
    && !href?.endsWith(".jpg")
    && !href?.endsWith(".png")
  ) {
    return (
      <Link {...props} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a {...props} href={href} target={href?.startsWith("#") ? undefined : "_blank"}>{children}</a>
  );
}

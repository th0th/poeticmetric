import Link from "next/link";
import React from "react";

export type AnchorProps = React.PropsWithoutRef<JSX.IntrinsicElements["a"]>;

export function Anchor({ children, href, ...props }: AnchorProps) {
  if (
    (href?.startsWith("/") || href?.startsWith("#"))
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
    <a {...props} href={href} referrerPolicy="origin-when-cross-origin" target="_blank">{children}</a>
  );
}

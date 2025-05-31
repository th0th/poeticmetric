import { JSX, PropsWithoutRef } from "react";
import { Link } from "react-router";

export type AnchorProps = Pick<PropsWithoutRef<JSX.IntrinsicElements["a"]>, "className" | "href">;

export default function Anchor({ href, ...props }: AnchorProps) {
  const isExternal = href === undefined || href.startsWith("http");

  return isExternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={href} target="_blank" />
  ) : (
    <Link {...props} to={href} />
  );
}
